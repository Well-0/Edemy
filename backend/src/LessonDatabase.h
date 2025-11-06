#pragma once
#include "Lesson.h"
#include <vector>
#include <mutex>

class LessonDatabase {
private:
    std::vector<Lesson> lessons;
    std::mutex mutex_;
    int next_id = 1;

public:
    LessonDatabase();
    std::vector<Lesson> getAllLessons();
    Lesson* getLessonById(int id);
    Lesson addLesson(const std::string& title, const std::string& description, int duration);
};