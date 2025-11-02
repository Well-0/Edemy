# Edemy



# Install dependencies

```cmd
npm install

```

# Run app in development

```cmd
npm run build
npm start
```

Or use my launch configuration for VSCode to run the app in debug mode.

'Run Electron App' config.

For Intellij IDEA, create a new Node.js run configuration with the following settings:
- JavaScript file: `node_modules/electron/dist/electron.exe`
- Application parameters: `.` (dot)
- Working directory: your project root folder

and import my config folder as .idea/runConfigurations to reuse the configuration.

# Build executable

npm run build

## A project structure example

```
project/
├── src/
│   ├── html/
│   │   └── home.html
│   ├── ts/
│   │   ├── home.ts
│   │   └── styles.ts
│   ├── index.html
│   ├── main.ts
│   └── renderer.ts
├── dist/           (generated)
├── moresuggestions.md
├── package.json
├── README.md
├── sample.html
├── styles.old
├── suggestions.md
└── tsconfig.json

```

### note that you may need to adjust the build scripts in package.json to fit your project structure during development.

Creates an executable in the `dist` folder when packaged.

For development with auto-rebuild, run `npm run watch` in a separate terminal
