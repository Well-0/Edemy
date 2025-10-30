cmake_minimum_required(VERSION 3.16)
project(MyQtApp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_AUTOMOC ON)
set(CMAKE_PREFIX_PATH "C:/Qt/6.10.0/mingw_64")

find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_executable(MyQtApp main.cpp)
target_link_libraries(MyQtApp Qt6::Widgets)

if(WIN32)
    find_program(WINDEPLOYQT_EXECUTABLE windeployqt HINTS "${CMAKE_PREFIX_PATH}/bin")
    if(WINDEPLOYQT_EXECUTABLE)
        add_custom_command(TARGET MyQtApp POST_BUILD
            COMMAND ${WINDEPLOYQT_EXECUTABLE} --no-translations --no-system-d3d-compiler --no-opengl-sw "$<TARGET_FILE:MyQtApp>"
            COMMENT "Running windeployqt..."
        )
    endif()
endif()