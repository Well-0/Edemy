#include "LessonDatabase.h"

LessonDatabase::LessonDatabase() {
    lessons = {}; // Empty initialization
}

std::vector<Lesson> LessonDatabase::getAllLessons() {
    std::lock_guard<std::mutex> lock(mutex_);
    return lessons;
}

Lesson* LessonDatabase::getLessonById(int id) {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto& lesson : lessons) {
        if (lesson.id == id) return &lesson;
    }
    return nullptr;
}

Lesson LessonDatabase::addLesson(const std::string& title, const std::string& description, int duration) {
    std::lock_guard<std::mutex> lock(mutex_);
    Lesson lesson = {next_id++, title, description, duration};
    lessons.push_back(lesson);
    return lesson;
}