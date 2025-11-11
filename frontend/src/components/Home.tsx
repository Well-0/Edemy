import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../css/Home.css';

// Type declaration for File System Access API
declare global {
  // Extend the Window interface
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }
}

interface FileSystemDirectoryHandle {
  name : string;
  values(): AsyncIterable<FileSystemHandle>;
  getFileHandle(name: string): Promise<FileSystemFileHandle>;
  getDirectoryHandle(name: string): Promise<FileSystemDirectoryHandle>;
  getDriveHandle(): Promise<FileSystemDirectoryHandle>;
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

interface FileSystemHandle {
  kind: 'file' | 'directory';
  name: string;
}

interface FileData {
  path: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

export default function Home() {
  const { isDark } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [scannedFiles, setScannedFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [selectedDrive, setSelectedDrive] = useState<string>('');
    const [folderName, setFolderName] = useState<string>(''); 



  // Handle folder selection and initiate scanning
  const handleFolderSelect = async () => {
        if (!selectedDrive) {
      setUploadStatus('Please select a drive first');
      return;
    }
    try {
   // Prompt user to select a directory
      const dirHandle = await window.showDirectoryPicker();

          const folderName = dirHandle.name;
          //  dirHandle.getDriveHandle ? await dirHandle.getDriveHandle() : dirHandle;
      //get folder name to string
      setFolderName(folderName);
      console.log('[Upload] Selected folder:', folderName);
      setIsUploading(true);
      setScannedFiles([]);


        const files: FileData[] = [];
      await scanDirectory(dirHandle, '', files);

      setScannedFiles(files);

      setIsUploading(false);
      setUploadStatus('Upload complete!');
      console.log('[Upload] Complete. Total files:', files.length);
    } catch (err) {
      console.error('[Upload] Error:', err);
      setIsUploading(false);
      setUploadStatus('Upload cancelled or failed');
    }
  };

  // Recursively scan directory - now builds array and returns it
 const scanDirectory = async (
      dirHandle: FileSystemDirectoryHandle,
      relativePath: string,
      files: FileData[]
      ): Promise<void> => {
        try {
          const entries: FileSystemHandle[] = [];
          for await (const entry of dirHandle.values()) {
            entries.push(entry);
          }

      // Separate folders and files
      const folders = entries.filter(e => e.kind === 'directory');
      const fileEntries = entries.filter(e => e.kind === 'file');

          // process files
      console.log(`[Scan] Processing ${fileEntries.length} files in ${relativePath || 'root'}`);
      for (const entry of fileEntries) {
        const fullPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        setCurrentFile(`📄 ${fullPath}`);
        setUploadStatus(`Scanning: ${entry.name}`);
        console.log('[Scan] File:', fullPath);
        
        files.push({
          path: fullPath,
          name: entry.name,
          type: getFileType(entry.name),
          size: 0
        });
      }
      // process folders
      console.log(`[Scan] Processing ${folders.length} folders in ${relativePath || 'root'}`);
      for (const entry of folders) {
        const fullPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        setCurrentFile(`📁 ${fullPath}`);
        setUploadStatus(`Scanning folder: ${fullPath}`);
        console.log('[Scan] Directory:', fullPath);
        
        try {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
          await scanDirectory(
            subDirHandle as unknown as FileSystemDirectoryHandle,
            fullPath,
            files
          );
        } catch (err) {
          console.warn('[Scan] Could not access directory:', entry.name, err);
        }
      }
    } catch (err) {
      console.error('[Scan] Error scanning directory:', err);
    }
  };


  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      'mp4': 'video/mp4',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska',
      'pdf': 'application/pdf',
      'html': 'text/html',
      'htm': 'text/html',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'json': 'application/json'
    };
    return typeMap[ext || ''] || 'application/octet-stream';
  };

  const downloadJSON = () => {
    const json = JSON.stringify(scannedFiles, null, 2); // Pretty print with 2 spaces
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scanned-files.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const copyFolder = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/copy-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        drive: selectedDrive,
        files: scannedFiles,
        folderName: folderName
        
      })
    });
    const result = await response.json();
    console.log('[Process] Files saved to:', result.location);
  } catch (err) {
    console.error('[Process] Error:', err);
  }
};

  return (
    <div className={`home-container ${isDark ? 'dark' : 'light'}`}>
      <div className="home-card">
        <h1 className="home-title">Welcome to Edemy</h1>
        <p className="home-subtitle">Load your learning materials and start your journey</p>

        {!isUploading && scannedFiles.length === 0 && (
          <div className="upload-section">
            <div className="mb-3">
              <label htmlFor="driveSelect" className="form-label">Select Drive:</label>
              <select 
                id="driveSelect"
                className="form-select" 
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
              >
                <option value="">-- Choose a drive --</option>
                <option value="C">C: Drive</option>
                <option value="D">D: Drive</option>
                <option value="E">E: Drive</option>
                <option value="F">F: Drive</option>
              </select>
            </div>

            <div className="upload-area" onClick={handleFolderSelect}>
              <div className="upload-icon">📁</div>
              <div className="upload-text">Click to select folder</div>
              <div className="upload-hint">Choose a folder with videos, PDFs, documents, or course materials</div>
            </div>

            <div className="file-types">
              <span className="file-type-badge">📄 PDF</span>
              <span className="file-type-badge">🎥 Video</span>
              <span className="file-type-badge">📝 Documents</span>
              <span className="file-type-badge">🌐 HTML</span>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="loading-section">
            <div className="spinner-border text-primary mb-3">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>{uploadStatus}</h4>
            <p className="current-file">{currentFile}</p>
            <div className="progress">
              <div className="progress-bar progress-bar-striped progress-bar-animated"></div>
            </div>
            <p className="file-count">Files scanned: {scannedFiles.length}</p>
          </div>
        )}

        {!isUploading && scannedFiles.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h4>Scanned Files ({scannedFiles.length})</h4>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={downloadJSON}>💾 Download JSON</button>
                  <button className="btn btn-success" onClick={copyFolder} disabled={scannedFiles.length === 0}>➡️ Process</button>
                <button className="btn btn-secondary" onClick={() => setScannedFiles([])}>🔄 Reset</button>
              </div>
            </div>
            
            <div className="file-list">
              {scannedFiles.map((file, idx) => (
                <div key={idx} className="file-item">
                  <span className="file-icon">
                    {file.type.startsWith('video') ? '🎥' : 
                     file.type === 'application/pdf' ? '📕' :
                     file.type === 'text/html' ? '🌐' : '📄'}
                  </span>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <small className="file-meta">
                      {file.path} • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}