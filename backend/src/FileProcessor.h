#pragma once
#include <string>
#include <nlohmann/json.hpp>

class FileProcessor {
public:
    static std::string getAppDataPath();
    static bool createDirectory(const std::string& path);
    static bool downloadFile(const std::string& sourcePath, const std::string& destPath);
    static void processFileList (const nlohmann::json& fileList);
};