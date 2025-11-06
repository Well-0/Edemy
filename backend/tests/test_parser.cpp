#include "FileProcessor.h"
#include <nlohmann/json.hpp>
#include <fstream>
#include <iostream>
#include <filesystem>

using json = nlohmann::json;

int main() {
    std::ifstream input("C:\\Users\\daria\\Downloads\\scanned-files.json");
    if (!input.is_open()) {
        std::cerr << "Failed to open scanned-files.json\n";
        return 1;
    }
    
    json fileList;
    input >> fileList;
    input.close();
    
    std::cout << "Loaded " << fileList.size() << " files from JSON\n";
    
    std::string baseDir = FileProcessor::getAppDataPath();
    std::cout << "Target directory: " << baseDir << '\n';
    
    FileProcessor::createDirectory(baseDir);
    
    for (const auto& file : fileList) {
        std::string path = file["path"];
        std::string destPath = baseDir + "\\" + path;
        
        std::filesystem::path dest(destPath);
        FileProcessor::createDirectory(dest.parent_path().string());
        
        if (file.contains("content")) {
            std::ofstream out(destPath);
            out << file["content"].get<std::string>();
            out.close();
            std::cout << "✓ Written: " << path << '\n';
        } else {
            std::cout << "○ Structure: " << path << '\n';
        }
    }
    
    std::cout << "\n✅ Complete! Check: " << baseDir << '\n';
    return 0;
}