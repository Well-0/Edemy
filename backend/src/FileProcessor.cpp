#include "FileProcessor.h"
#include <nlohmann/json.hpp>
#include <cstdlib>
#include <filesystem>
#include <iostream>
#include <fstream>

namespace fs = std::filesystem;
using json = nlohmann::json;

// Get the application data path, e.g., %APPDATA%/Edemy
std::string FileProcessor::getAppDataPath() {
    const char* appData = std::getenv("APPDATA");
    if (appData) {
        fs::path base(appData);
        base /= "Edemy";
        return base.string();
    }
    fs::path fallback = fs::current_path() / "Edemy";
    return fallback.string();
}

bool FileProcessor::createDirectory(const std::string& path) {
    if (path.empty()) return false;
    fs::path dir(path);
    if (fs::exists(dir)) return true;
    return fs::create_directories(dir);
}

bool FileProcessor::downloadFile(const std::string& sourcePath, const std::string& destPath) {
    try {
        fs::path src(sourcePath);
        fs::path dst(destPath);

        if (!fs::exists(src)) {
            std::cerr << "[FileProcessor] Source not found: " << sourcePath << '\n';
            return false;
        }
    
        fs::copy_file(src, dst, fs::copy_options::overwrite_existing);
        return true;
    } catch (const fs::filesystem_error& err) {
        std::cerr << "[FileProcessor] Copy failed: " << err.what() << '\n';
        return false;
    }
}

void FileProcessor::processFileList(const json& fileList) {
    if (!fileList.is_array()) {
        std::cerr << "[FileProcessor] Expected JSON array\n";
        return;
    }
     std::string baseDir = getAppDataPath();
    if (!createDirectory(baseDir)) {
        std::cerr << "[FileProcessor] Failed to create base directory\n";
        return;
    }
    for (const auto& file : fileList) {
        std::string path = file.value("path", "");
        if (path.empty()) continue;
        
        // Extract directory from path and create it
        fs::path fullPath = fs::path(baseDir) / path;
        fs::path parentDir = fullPath.parent_path();
        
        if (!parentDir.empty()) {
            createDirectory(parentDir.string());
        }
        
        // If file has content, write it
        if (file.contains("content")) {
            std::ofstream out(fullPath, std::ios::binary);
            std::string content = file.value("content", "");
            out.write(content.data(), content.size());
            std::cout << "[FileProcessor] Created: " << path << "\n";
        } else {
            // Create empty placeholder file
            std::ofstream out(fullPath);
            std::cout << "[FileProcessor] Created placeholder: " << path << "\n";
        }
    }
}