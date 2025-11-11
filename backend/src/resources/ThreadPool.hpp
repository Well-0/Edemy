// ThreadPool.hpp
#pragma once
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>

class ThreadPool {
public:
// Create a thread pool with n threads (default: number of hardware threads)
    explicit ThreadPool(std::size_t n = std::thread::hardware_concurrency())
        : stop_(false) {
            // Launch worker threads
        for (std::size_t i = 0; i < n; ++i)
            workers_.emplace_back([this] { worker(); });
    }
    // Destructor joins all threads
    ~ThreadPool() {
        { std::unique_lock lk(qm_); stop_ = true; }
        // Notify all workers to stop
        cv_.notify_all();
        for (auto& w : workers_) w.join();
    }
    // Enqueue a new task
    template<class F>
    //  -> std::future<decltype(f())> is decltype deduction for return type
    auto enqueue(F&& f) -> std::future<decltype(f())> {
        using R = decltype(f());
        // Wrap the function into a packaged_task
        auto task = std::make_shared<std::packaged_task<R()>>(std::forward<F>(f));
        std::future<R> res = task->get_future();
        {
            std::unique_lock lk(qm_); // Lock the queue mutex
             // Add the task to the queue
            tasks_.emplace([task]() { (*task)(); });
        }
        cv_.notify_one();
        return res;
    }
private:
    void worker() {
        while (true) {
            std::function<void()> job;
            {
                std::unique_lock lk(qm_);
                cv_.wait(lk, [this] { return stop_ || !tasks_.empty(); });
                if (stop_ && tasks_.empty()) return;
                job = std::move(tasks_.front());
                tasks_.pop();
            }
            job();
        }
    }
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex qm_;
    std::condition_variable cv_;
    bool stop_;
};