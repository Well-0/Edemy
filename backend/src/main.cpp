#include <httplib.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <vector>
#include <string>
#include <mutex>

using json = nlohmann::json;

struct Lesson {
    int id;
    std::string title;
    std::string description;
    int duration; // minutes
};

class LessonDatabase {
private:
    std::vector<Lesson> lessons;
    std::mutex mutex_;
    int next_id = 1;

public:
    LessonDatabase() {
        // Initialize with sample data
        lessons = {
            {next_id++, "Introduction to C++", "Learn the basics of C++ programming", 45},
            {next_id++, "React Fundamentals", "Master React hooks and components", 60},
            {next_id++, "Advanced TypeScript", "Deep dive into TypeScript features", 90}
        };
    }

    std::vector<Lesson> getAllLessons() {
        std::lock_guard<std::mutex> lock(mutex_);
        return lessons;
    }

    Lesson* getLessonById(int id) {
        std::lock_guard<std::mutex> lock(mutex_);
        for (auto& lesson : lessons) {
            if (lesson.id == id) {
                return &lesson;
            }
        }
        return nullptr;
    }

    Lesson addLesson(const std::string& title, const std::string& description, 
                      int duration) {
        std::lock_guard<std::mutex> lock(mutex_);
        Lesson lesson = {next_id++, title, description, duration};
        lessons.push_back(lesson);
        return lesson;
    }
};

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
    httplib::Server server;
    LessonDatabase db;

    // Enable CORS for React development
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    // Handle OPTIONS requests for CORS preflight
    server.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 204;
    });

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

    std::cout << "🚀 Edemy Backend Server starting on http://localhost:8080" << std::endl;
    std::cout << "📚 Endpoints:" << std::endl;
    std::cout << "   GET  /api/health" << std::endl;
    std::cout << "   GET  /api/lessons" << std::endl;
    std::cout << "   GET  /api/lessons/:id" << std::endl;
    std::cout << "   POST /api/lessons" << std::endl;
    
    server.listen("0.0.0.0", 8080);
    
    return 0;
}