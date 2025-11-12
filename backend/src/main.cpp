#include <httplib.h>
#include <nlohmann/json.hpp>
#include <algorithm>
#include <cctype>
#include <iomanip>
#include <iostream>
#include <mutex>
#include <optional>
#include <sstream>
#include <string>
#include <thread>
#include <vector>
#include <filesystem>
#include "LessonDatabase.h"
#include "Lesson.h"
#include "FileProcessor.h"
#include "resources/ParallelCopy.hpp"
#include "resources/ThreadPool.hpp"

using json = nlohmann::json;
namespace fs = std::filesystem;

namespace {

constexpr std::size_t kWindowsSafePathLimit = 248; // keep some headroom below MAX_PATH
constexpr std::size_t kMinSanitizedLength   = 16;
constexpr std::size_t kMaxSanitizedLength   = 64;

std::size_t computeLongestRelativeLength(const fs::path& root) {
    std::size_t longest = 0;
    std::error_code ec;
    if (!fs::exists(root, ec) || !fs::is_directory(root, ec)) {
        return longest;
    }
    // Measure the longest relative path length
    fs::recursive_directory_iterator it(
        root,
        fs::directory_options::skip_permission_denied,
        ec
    );
    fs::recursive_directory_iterator end;

    // Iterate through all entries
    while (!ec && it != end) {
        std::error_code relEc;
        auto rel = fs::relative(it->path(), root, relEc);
        if (!relEc) {
            auto relStr = rel.generic_u8string();
            if (relStr.size() > longest) {
                longest = relStr.size();
            }
        }
        it.increment(ec); // Move to next entry
    }
    // Done iterating
    return longest;
}

// Create a hex suffix from a size_t value
std::string makeHashSuffix(std::size_t value, std::size_t maxLen) {
    std::ostringstream oss;
    oss << std::hex << std::nouppercase << value;
    std::string hex = oss.str();
    if (hex.empty()) {
        hex = "0";
    }
    if (maxLen && hex.size() > maxLen) {
        hex.resize(maxLen);
    }
    return hex;
}

// Sanitize folder name for Windows filesystem
std::string sanitizeFolderName(const std::string& raw, std::size_t maxLen) {
    static constexpr char kInvalidChars[] = "[]<>:\"|?*";
    std::string sanitized;
    sanitized.reserve(raw.size()); // Reserve space to avoid multiple allocations

    for (char ch : raw) {
        if (std::iscntrl(static_cast<unsigned char>(ch)) ||
            std::find(std::begin(kInvalidChars), std::end(kInvalidChars), ch) != std::end(kInvalidChars)) {
            sanitized.push_back('_');
        } else {
            sanitized.push_back(ch);
        }
    }

    // Trim trailing spaces or dots (Windows does not allow them)
    while (!sanitized.empty() && (sanitized.back() == ' ' || sanitized.back() == '.')) {
        sanitized.pop_back();
    }

    if (sanitized.empty()) {
        sanitized = "EdemyCopy";
    }
    // If within limits, return as is
    if (maxLen == 0 || sanitized.size() <= maxLen) {
        return sanitized;
    }
    // Need to trim and append hash suffix
    const std::size_t suffixBudget = maxLen > kMinSanitizedLength ? 8 : 6;
    std::string hash = makeHashSuffix(std::hash<std::string>{}(sanitized), suffixBudget);

    std::size_t keep = (maxLen > hash.size() + 1) ? (maxLen - hash.size() - 1) : 0;
    std::string trimmed = keep ? sanitized.substr(0, keep) : std::string();

    while (!trimmed.empty() && (trimmed.back() == ' ' || trimmed.back() == '.')) {
        trimmed.pop_back();
    }

    if (trimmed.empty()) {
        trimmed = "Edemy";
    }

    trimmed.push_back('_');
    trimmed.append(hash);

    if (trimmed.size() > maxLen) {
        trimmed.resize(maxLen);
    }
    // Return the final sanitized folder name
    return trimmed;
}

std::size_t determineSanitizedLimit(const fs::path& base, const fs::path& sourceRoot) {
    const std::size_t baseLen = base.string().size();
    const std::size_t longestRel = computeLongestRelativeLength(sourceRoot);
    // Quick check for immediate impossibility
    if (baseLen + 1 >= kWindowsSafePathLimit) {
        return kMinSanitizedLength;
    }

    std::size_t available = 0;
    if (kWindowsSafePathLimit > baseLen + 1 + longestRel) {
        available = kWindowsSafePathLimit - (baseLen + 1 + longestRel);
    }

    if (available < kMinSanitizedLength) {
        return 0;
    }

    if (available > kMaxSanitizedLength) {
        return kMaxSanitizedLength;
    }

    return available; // within limits
}

} // namespace

json lessonToJson(const Lesson& lesson) {
    return {
        {"id", lesson.id},
        {"title", lesson.title},
        {"description", lesson.description},
        {"duration", lesson.duration}
    };
}

// Global context so we can poll progress from request handlers
static std::unique_ptr<CopyCtx> gCopyCtx;
static std::mutex gCopyCtxMutex;

int main() {
    std::cout << "=== Edemy Backend Starting ===" << std::endl;
    std::cout << "Step 1: Initializing..." << std::endl;
    std::cout.flush();
    
    try {
        std::cout << "Step 2: Creating server..." << std::endl;
        std::cout.flush();
        httplib::Server server;
        
        std::cout << "Step 3: Creating database..." << std::endl;
        std::cout.flush();
        LessonDatabase db;

        std::cout << "Step 4: Setting up CORS..." << std::endl;
        std::cout.flush();

            // Handle OPTIONS requests once for CORS preflight
    server.Options(".*", [](const httplib::Request&, httplib::Response& res) {
            res.status = 204;
        });

         // CORS middleware - add CORS headers to ALL responses (after routing)
        server.set_post_routing_handler([](const httplib::Request&, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type");
        });
        std::cout << "Step 5: Defining endpoints..." << std::endl;
        std::cout.flush();



    // Health check
    server.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        json response = {{"status", "ok"}, {"message", "Backend is running"}};
        res.set_content(response.dump(), "application/json");
    });

    // Get all lessons
    server.Get("/api/lessons", [&db](const httplib::Request&, httplib::Response& res) {
        auto lessons = db.getAllLessons();
        json response = json::array();
        for (const auto& lesson : lessons) {
            response.push_back(lessonToJson(lesson));
        }
        res.set_content(response.dump(), "application/json");
    });

    // Get lesson by ID
    server.Get("/api/lessons/(\\d+)", [&db](const httplib::Request& req, httplib::Response& res) {
        int id = std::stoi(req.matches[1]);
        auto* lesson = db.getLessonById(id);
        
        if (lesson) {
            res.set_content(lessonToJson(*lesson).dump(), "application/json");
        } else {
            json error = {{"error", "Lesson not found"}};
            res.status = 404;
            res.set_content(error.dump(), "application/json");
        }
    });

    // Create new lesson
    server.Post("/api/lessons", [&db](const httplib::Request& req, httplib::Response& res) {
        try {
            auto data = json::parse(req.body);
            auto lesson = db.addLesson(
                data["title"],
                data["description"],
                data["duration"]
            );
            res.status = 201;
            res.set_content(lessonToJson(lesson).dump(), "application/json");
        } catch (const std::exception& e) {
            json error = {{"error", "Invalid request data"}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    });

    // Process file list
 /*   server.Post("/api/process-files", [](const httplib::Request& req, httplib::Response& res) {
    try {
        // Validate and parse the request body
        auto fileList = json::parse(req.body);
        FileProcessor::processFileList(fileList);
        
        json response = {
            {"status", "success"},
            {"message", "Files processed"},
            {"location", FileProcessor::getAppDataPath()}
        };
        res.set_content(response.dump(), "application/json");
    } catch (const std::exception& e) {
        json error = {{"error", e.what()}};
        res.status = 400;
        res.set_content(error.dump(), "application/json");
    }
});
*/

//Copy folder dir 
server.Post("/api/copy-folder", [](const httplib::Request& req, httplib::Response& res) {
    try {
        auto data = json::parse(req.body);
        // Validate required fields
        if (!data.contains("drive") || !data.contains("folderName")) {
            json error = {{"error", "drive and folderName are required"}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
            return;
        }
        // Extract string and validate parameters
        std::string drive = data["drive"].get<std::string>();
        std::string folderName = data["folderName"].get<std::string>();

        if (drive.empty()) {
            json error = {{"error", "Drive letter cannot be empty"}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
            return;
        }
        // Use only the first character as drive letter
        if (drive.size() > 1) {
            drive = drive.substr(0, 1);
        }
            //FIXME: Change hardcoded "/torrent" path
        fs::path srcPath = fs::path(drive + ":/torrent") / folderName;
        if (!fs::exists(srcPath)) {
            json error = {{"error", "Source not found"}, {"path", srcPath.string()}};
            res.status = 404;
            res.set_content(error.dump(), "application/json");
            return;
        }

        fs::path baseDest = FileProcessor::getAppDataPath();
        if (!FileProcessor::createDirectory(baseDest.string())) {
            json error = {{"error", "Unable to ensure base destination directory"}, {"path", baseDest.string()}};
            res.status = 500;
            res.set_content(error.dump(), "application/json");
            return;
        }

        std::size_t sanitizedLimit = determineSanitizedLimit(baseDest, srcPath);
        if (sanitizedLimit == 0) {
            json error = {{"error", "Destination path would exceed Windows limits"}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
            return;
        }

        std::string sanitizedRoot = sanitizeFolderName(folderName, sanitizedLimit);
        fs::path dstPath = baseDest / sanitizedRoot;

        std::error_code createEc;
        fs::create_directories(dstPath, createEc);
        if (createEc) {
            json error = {{"error", "Failed to prepare destination"}, {"details", createEc.message()}, {"path", dstPath.string()}};
            res.status = 500;
            res.set_content(error.dump(), "application/json");
            return;
        }

        CopyCtx* ctxPtr = nullptr;
        {
            std::lock_guard<std::mutex> guard(gCopyCtxMutex);
            if (gCopyCtx) {
                json error = {{"error", "Another copy operation is already running"}};
                res.status = 409;
                res.set_content(error.dump(), "application/json");
                return;
            }

            const unsigned int hardwareThreads = std::max(2u, std::thread::hardware_concurrency());
            gCopyCtx = std::make_unique<CopyCtx>(hardwareThreads);
            ctxPtr = gCopyCtx.get();
        }

        ctxPtr->bytesTotal.store(0);
        ctxPtr->bytesDone.store(0);
        ctxPtr->cancel.store(false);

        std::thread([srcPath, dstPath, ctxPtr]() {
            try {
                copyDirParallel(srcPath, dstPath, *ctxPtr);
                // * Success log
                std::cout << "[Copy] Done: " << ctxPtr->bytesDone.load() << " bytes\n";
            } catch (const std::exception& ex) {
                std::cerr << "[Copy] Error: " << ex.what() << std::endl;
            }

            std::lock_guard<std::mutex> guard(gCopyCtxMutex);
            gCopyCtx.reset();
        }).detach();

        json response = {
            {"status", "started"},
            {"source", srcPath.string()},
            {"destination", dstPath.string()},
            {"sanitizedFolder", sanitizedRoot},
            {"sanitizedLimit", sanitizedLimit}
        };
        res.set_content(response.dump(), "application/json");

    } catch (const std::exception& e) {
        json error = {{"error", e.what()}};
        res.status = 400;
        res.set_content(error.dump(), "application/json");
    }
});

server.Get("/api/copy-progress", [](const httplib::Request&, httplib::Response& res) {
    json payload;

    std::lock_guard<std::mutex> guard(gCopyCtxMutex);
    if (!gCopyCtx) {
        payload["active"] = false;
        payload["bytesTotal"] = 0;
        payload["bytesDone"] = 0;
        payload["percent"] = 100;
    } else {
        const uint64_t total = gCopyCtx->bytesTotal.load();
        const uint64_t done  = gCopyCtx->bytesDone.load();
        payload["active"] = true;
        payload["bytesTotal"] = total;
        payload["bytesDone"] = done;
        payload["percent"] = total ? static_cast<int>((done * 100) / total) : 0;
    }

    res.set_content(payload.dump(), "application/json");
});
// ? Api endpoint for BrowseLessons.tsx
// Get list of courses from AppData
server.Get("/api/courses", [](const httplib::Request&, httplib::Response& res) {
    try {
        std::string basePath = FileProcessor::getAppDataPath();
        json courses = json::array();
        
        if (fs::exists(basePath)) {
            for (const auto& entry : fs::directory_iterator(basePath)) {
                if (entry.is_directory()) {
                    json course = {
                        {"name", entry.path().filename().string()},
                        {"path", entry.path().string()}
                    };
                    
                    // Count files in directory
                    int fileCount = 0;
                    for (const auto& _ : fs::recursive_directory_iterator(entry.path())) {
                        if (fs::is_regular_file(_)) fileCount++;
                    }
                    course["fileCount"] = fileCount;
                    
                    courses.push_back(course);
                }
            }
        }
        
        json response = {{"courses", courses}};
        res.set_content(response.dump(), "application/json");
    } catch (const std::exception& e) {
        json error = {{"error", e.what()}};
        res.status = 500;
        res.set_content(error.dump(), "application/json");
    }
});

 std::cout << "🚀 Edemy Backend Server starting on http://localhost:8080" << std::endl;
std::cout << "📚 Endpoints:" << std::endl;
std::cout << "   GET  /api/health" << std::endl;
std::cout << "   GET  /api/lessons" << std::endl;
std::cout << "   GET  /api/lessons/:id" << std::endl;
std::cout << "   POST /api/lessons" << std::endl;
std::cout << "   POST /api/process-files" << std::endl;
std::cout << "   POST /api/copy-folder" << std::endl;
std::cout << "   GET  /api/copy-progress" << std::endl;
std::cout << "\n✅ Server is ready and listening..." << std::endl;
std::cout.flush();  // Force output before blocking

if (!server.listen("0.0.0.0", 8080)) {
    std::cerr << "❌ Failed to start server on port 8080" << std::endl;
    return 1;
}

    } catch (const std::exception& e) {
        std::cerr << "❌ Fatal error: " << e.what() << std::endl;
        return 1;
    }
    
    return 0;
}