cmake_minimum_required(VERSION 3.16)
project(edemy_backend)

set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

FetchContent_Declare(
  httplib
  GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
  GIT_TAG v0.14.3
)

FetchContent_Declare(
  json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG v3.11.3
)

FetchContent_MakeAvailable(httplib json)

# Main backend server
add_executable(edemy_backend 
  src/main.cpp 
  src/LessonDatabase.cpp 
  src/FileProcessor.cpp
)
target_link_libraries(edemy_backend 
  PRIVATE 
  httplib::httplib 
  nlohmann_json::nlohmann_json
  ws2_32
)

# Test parser tool
add_executable(test_parser 
  tests/test_parser.cpp 
  src/FileProcessor.cpp
)
target_link_libraries(test_parser 
  PRIVATE 
  nlohmann_json::nlohmann_json
)
target_include_directories(test_parser PRIVATE src)