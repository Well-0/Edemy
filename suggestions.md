Store user-imported files in the **app's userData directory** with organized subfolders:

```TypeScript
// src/ts/file-manager.ts
import * as fs from 'fs';
import * as path from 'path';
import { app, dialog } from 'electron';
import { ipcMain } from 'electron';

export class FileManager {
  private storagePath: string;

  constructor() {
    // e.g., C:\Users\Username\AppData\Roaming\edemy\user-files
    this.storagePath = path.join(app.getPath('userData'), 'user-files');
    this.initDirectories();
  }

  private initDirectories() {
    const dirs = ['pdfs', 'videos', 'downloads', 'courses'];
    dirs.forEach(dir => {
      const dirPath = path.join(this.storagePath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async importFile(type: 'pdf' | 'video' | 'download'): Promise<string | null> {
    const filters = {
      pdf: [{ name: 'PDFs', extensions: ['pdf'] }],
      video: [{ name: 'Videos', extensions: ['mp4', 'webm', 'mkv'] }],
      download: [{ name: 'Archives', extensions: ['zip', 'rar', '7z'] }]
    };

    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: filters[type]
    });

    if (result.canceled || !result.filePaths.length) return null;

    const sourcePath = result.filePaths[0];
    const fileName = path.basename(sourcePath);
    const destPath = path.join(this.storagePath, `${type}s`, fileName);

    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    
    return destPath;
  }

  getFilePath(type: string, fileName: string): string {
    return path.join(this.storagePath, `${type}s`, fileName);
  }

  listFiles(type: string): string[] {
    const dir = path.join(this.storagePath, `${type}s`);
    return fs.readdirSync(dir);
  }

  deleteFile(type: string, fileName: string): void {
    const filePath = this.getFilePath(type, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
```

**Setup IPC in main.ts:**

```TypeScript
// src/main.ts
import { FileManager } from './ts/file-manager';

const fileManager = new FileManager();

ipcMain.handle('import-file', async (_, type: 'pdf' | 'video' | 'download') => {
  return await fileManager.importFile(type);
});

ipcMain.handle('get-file-path', (_, type: string, fileName: string) => {
  return fileManager.getFilePath(type, fileName);
});

ipcMain.handle('list-files', (_, type: string) => {
  return fileManager.listFiles(type);
});

ipcMain.handle('delete-file', (_, type: string, fileName: string) => {
  fileManager.deleteFile(type, fileName);
});
```

**Use in renderer:**

```TypeScript
// src/ts/course-page.ts
import { ipcRenderer } from 'electron';

async function importPDF() {
  const filePath = await ipcRenderer.invoke('import-file', 'pdf');
  if (filePath) {
    console.log('PDF imported:', filePath);
    // Display in UI
  }
}

async function loadVideo(fileName: string) {
  const videoPath = await ipcRenderer.invoke('get-file-path', 'video', fileName);
  $('video').attr('src', `file://${videoPath}`);
}
```

**File structure:**

```
C:\Users\Username\AppData\Roaming\edemy\
  └── user-files\
      ├── pdfs\
      ├── videos\
      ├── downloads\
      └── courses\
```

This keeps imported content separate from app code and persists across updates.
