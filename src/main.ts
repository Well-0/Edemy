import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import * as path from 'path';

// Create the main application window
function createWindow(): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  // Load the index.html of the app
  win.loadFile(path.join(__dirname, '../src/index.html'));

  // Forward renderer console messages to main process console (terminal)
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message}`);
  });

  // Set custom menu where Window > Close navigates to homepage
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { 
          label: 'Close',
          click: () => win.loadFile(path.join(__dirname, '../src/index.html'))
        },
        { type: 'separator' },
        { role: 'front' }
      ]
      //keep the same Help menu
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          }
        },
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org/docs');
          }
        },
        {
          label: 'Community Discussions',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://www.electronjs.org/community');
          }
        },
        {
          label: 'Search Issues',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/electron/electron/issues');
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// Re-create a window in the app when the dock icon is clicked (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});