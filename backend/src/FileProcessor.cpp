#include "FileProcessor.h"
#include <nlohmann/json.hpp>
#include <cstdlib>
#include <filesystem>
#include <iostream>

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
    
    for (const auto& file : fileList) {
        std::string path = file.value("path", "");
        std::string name = file.value("name", "");
        std::string type = file.value("type", "");
        std::size_t size = file.value("size", 0ULL);

        std::cout << "[FileProcessor] Processing: " << path
                  << " (name: " << name << ", type: " << type
                  << ", size: " << size << ")\n";
    }
}