

//FIXME: Refactor repetitive className logic into a utility function
//FIXME: Consider extracting Menu components into separate files for better maintainability
//FIXME: Need to fix rendering Tailwindcss properly as its not recognizing some classes
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

type Theme = 'system' | 'light' | 'dark';

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>('system');
   

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
    
     
    
    if (shouldBeDark) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }, [theme]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container-fluid">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {/* File Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              File
            </a>
            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={() => navigate('/')}>
                  <i className="bi bi-house me-2"></i>Home
                </button>
              </li>
            </ul>
          </li>

          {/* Edit Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Edit
            </a>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item">Undo</button></li>
              <li><button className="dropdown-item">Redo</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item">Cut</button></li>
              <li><button className="dropdown-item">Copy</button></li>
              <li><button className="dropdown-item">Paste</button></li>
            </ul>
          </li>

          {/* View Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              View
            </a>
            <ul className="dropdown-menu">
              <li><h6 className="dropdown-header">Theme</h6></li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => setTheme('system')}
                >
                  <i className="bi bi-pc-display me-2"></i>
                  System {theme === 'system' && '✓'}
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => setTheme('light')}
                >
                  <i className="bi bi-sun me-2"></i>
                  Light {theme === 'light' && '✓'}
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item" 
                  onClick={() => setTheme('dark')}
                >
                  <i className="bi bi-moon me-2"></i>
                  Dark {theme === 'dark' && '✓'}
                </button>
              </li>
            </ul>
          </li>

          {/* Help Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Help
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="https://react.dev" target="_blank" rel="noopener noreferrer">
                  React Documentation
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://getbootstrap.com/docs" target="_blank" rel="noopener noreferrer">
                  Bootstrap Docs
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                  Vite Guide
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="https://github.com/facebook/react/issues" target="_blank" rel="noopener noreferrer">
                  React Issues
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}