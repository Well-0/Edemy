# Edemy

Edemy is a two-tier learning platform example with a C++ REST backend and a React + Vite frontend with BootStrap CSS.

## Project Structure

```cmd
/DAIN
├── backend/
│   ├── src/
│   │   └── main.cpp
│   └── CMakeLists.txt
└── frontend/
    ├── package.json # Vite + React toolchain
    └── src/         # React Components (Home, App, Entrypoint)
        ├── build/
        ├── App.tsx
        └── components/
            ├── Home.tsx
            └── ...
```

## Installing Dependencies

* **Backend**: Install CMake (>=3.16) and a C++17-capable compiler (MSVC, clang, or GCC). Configure once to fetch third-party libraries:

  ```cmd
  cmake -S backend -B backend/build
  ```

Frontend: Install Node.js (>=18). From frontend/, install npm packages:

```cmd
npm install
```

## Running the App

Start the backend server

```cmd
cmake --build backend/build --config Release
backend\build\Release\edemy\_backend.exe
```

(On non-MSVC generators, drop --config Release and run backend/build/edemy\_backend.) The API listens on <http://localhost:8080>.

Launch the frontend

```cmd
cd frontend
npm run dev
```

Vite serves the React app at the URL printed in the terminal (defaults to <http://localhost:5173>).

Start the backend before opening the frontend so API requests succeed. '@" \`\`\`



# Deploying App



## For Your Use Case: **CPack + GitHub Releases**

Update your CMakeLists.txt:

```
# At the end of CMakeLists.txt
install(TARGETS edemy_backend DESTINATION bin)

set(CPACK_PACKAGE_NAME "Edemy")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_VENDOR "YourName")
set(CPACK_GENERATOR "ZIP;NSIS")
include(CPack)

```

**Deploy:**

```
cmake --build build --config Release
cpack --config build/CPackConfig.cmake
# Creates Edemy-1.0.0-win64.zip

```

## **GitHub Releases** (Simple deployment)

&#x20;

Automate with GitHub Actions:

```YAML
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']
    
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: |
          cmake -S backend -B build -G Ninja
          cmake --build build --config Release
      - name: Package
        run: |
          mkdir dist
          cp build/edemy_backend.exe dist/
      - name: Upload Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/*
```

**Push tag** → **auto-build** → **release artifact**
