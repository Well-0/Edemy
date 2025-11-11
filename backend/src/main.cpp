#include <httplib.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <vector>
#include <string>
#include <mutex>
#include <optional>
#include "LessonDatabase.h"
#include "Lesson.h"
#include "FileProcessor.h"

using json = nlohmann::json;
 

json lessonToJson(const Lesson& lesson) {
    return {
        {"id", lesson.id},
        {"title", lesson.title},
        {"description", lesson.description},
        {"duration", lesson.duration}
    };
}
//TODO: Implement update and delete lesson handlers
//TODO: implement reading folder from JSON in Home.tsx

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
    //Copy folder dir (from frontend)
    server.Post("/api/copy-folder", [](const httplib::Request& req, httplib::Response& res) {
    try {
      res.status = 200;
      json response = {
          {"status", "success"},
          {"message", "Folder path received"}
      };    
        res.set_content(response.dump(), "application/json");
    } catch (const std::exception& e) {
        json error = {{"error", e.what()}};
        res.status = 400;
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