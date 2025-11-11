// ParallelCopy.hpp
#pragma once
#include <filesystem>
#include <atomic>
#include <chrono>
#include <fstream>   
#include <vector>    
#include <iostream>
#include "ThreadPool.hpp"

namespace fs = std::filesystem;
using namespace std::chrono_literals;

inline constexpr std::size_t CHUNK = 1 << 20;   // 1 MiB

struct CopyCtx {
    std::atomic<uint64_t> bytesTotal{0};
    std::atomic<uint64_t> bytesDone{0};
    std::atomic<bool>     cancel{false};
    ThreadPool            pool;
    explicit CopyCtx(std::size_t threads) : pool(threads) {}
};

inline void copyFileChunked(const fs::path& src,
                            const fs::path& dst,
                            CopyCtx& ctx)
{
      fs::create_directories(dst.parent_path()); 
    std::ifstream in(src,  std::ios::binary);
    std::ofstream out(dst, std::ios::binary | std::ios::trunc);
    if (!in || !out) return;

    in.seekg(0, std::ios::end);
    uint64_t size = in.tellg();
    in.seekg(0);
    ctx.bytesTotal += size;

    std::vector<char> buf(CHUNK);
    while (size && !ctx.cancel) {
        std::size_t n = std::min<std::size_t>(size, buf.size());
        in.read(buf.data(), n);
        out.write(buf.data(), n);
        ctx.bytesDone += n;
        size -= n;
    }
}

inline void copyDirParallel(const fs::path& src,
                            const fs::path& dst,
                            CopyCtx& ctx)
{
    if (ctx.cancel) return;
    
    // Create directories with error handling
    std::error_code ec;
    fs::create_directories(dst, ec);
    if (ec) {
        // Log error but continue - directory might already exist
        std::cerr << "[ParallelCopy] Failed to create: " << dst << " - " << ec.message() << std::endl;
        return;
    }
    
    for (const auto& entry : fs::directory_iterator(src)) {
        const auto& path = entry.path();
        auto rel = fs::relative(path, src);
        auto destPath = dst / rel;
        if (entry.is_directory()) {
            copyDirParallel(path, destPath, ctx);
        } else {
            // tiny file → immediate copy in caller thread
            if (entry.file_size() < 4 * CHUNK) {
                std::error_code copyEc;
                fs::copy_file(path, destPath, fs::copy_options::overwrite_existing, copyEc);
                if (!copyEc) {
                    ctx.bytesTotal += entry.file_size();
                    ctx.bytesDone  += entry.file_size();
                }
            } else {
                // big file → enqueue
                ctx.pool.enqueue([&ctx, path, destPath] {
                    copyFileChunked(path, destPath, ctx);
                });
            }
        }
    }
}