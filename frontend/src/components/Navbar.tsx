import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

type Theme = 'system' | 'light' | 'dark';


//FIXME: Refactor repetitive className logic into a utility function
//FIXME: Consider extracting Menu components into separate files for better maintainability
//FIXME: Need to fix rendering Tailwindcss properly as its not recognizing some classes
export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <nav className={clsx(
      'relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px',
      isDark ? 'bg-gray-800/50 after:bg-white/10' : 'bg-gray-50 after:bg-gray-200'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-start gap-6">
          
          {/* File Menu */}
          <Menu as="div" className="relative">
            <MenuButton className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
            )}>
              File
            </MenuButton>
            <MenuItems className={clsx(
              'absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md py-1 outline -outline-offset-1 shadow-lg transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
              isDark ? 'bg-gray-800 outline-white/10' : 'bg-white border border-gray-200'
            )}>
              <MenuItem>
                <button
                  onClick={() => navigate('/')}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm flex items-center gap-2',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  <HomeIcon className="w-4 h-4" />
                  Home
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* Edit Menu */}
          <Menu as="div" className="relative">
            <MenuButton className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
            )}>
              Edit
            </MenuButton>
            <MenuItems className={clsx(
              'absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md py-1 outline -outline-offset-1 shadow-lg transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
              isDark ? 'bg-gray-800 outline-white/10' : 'bg-white border border-gray-200'
            )}>
              <MenuItem>
                <button className={clsx(
                  'w-full text-left px-4 py-2 text-sm',
                  isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                )}>
                  Undo
                </button>
              </MenuItem>
              <MenuItem>
                <button className={clsx(
                  'w-full text-left px-4 py-2 text-sm',
                  isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                )}>
                  Redo
                </button>
              </MenuItem>
              <div className={clsx('border-t my-1', isDark ? 'border-white/10' : 'border-gray-200')}></div>
              <MenuItem>
                <button className={clsx(
                  'w-full text-left px-4 py-2 text-sm',
                  isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                )}>
                  Cut
                </button>
              </MenuItem>
              <MenuItem>
                <button className={clsx(
                  'w-full text-left px-4 py-2 text-sm',
                  isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                )}>
                  Copy
                </button>
              </MenuItem>
              <MenuItem>
                <button className={clsx(
                  'w-full text-left px-4 py-2 text-sm',
                  isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                )}>
                  Paste
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* View Menu */}
          <Menu as="div" className="relative">
            <MenuButton className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
            )}>
              View
            </MenuButton>
            <MenuItems className={clsx(
              'absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md py-1 outline -outline-offset-1 shadow-lg transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
              isDark ? 'bg-gray-800 outline-white/10' : 'bg-white border border-gray-200'
            )}>
              <div className={clsx('px-4 py-2 text-xs font-semibold', isDark ? 'text-gray-500' : 'text-gray-400')}>
                Theme
              </div>
              <MenuItem>
                <button
                  onClick={() => setTheme('system')}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm flex items-center gap-2',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                  System {theme === 'system' && '✓'}
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => setTheme('light')}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm flex items-center gap-2',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  <SunIcon className="w-4 h-4" />
                  Light {theme === 'light' && '✓'}
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={() => setTheme('dark')}
                  className={clsx(
                    'w-full text-left px-4 py-2 text-sm flex items-center gap-2',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  <MoonIcon className="w-4 h-4" />
                  Dark {theme === 'dark' && '✓'}
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>

          {/* Help Menu */}
          <Menu as="div" className="relative">
            <MenuButton className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              isDark ? 'text-gray-300 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-100'
            )}>
              Help
            </MenuButton>
            <MenuItems className={clsx(
              'absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md py-1 outline -outline-offset-1 shadow-lg transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in',
              isDark ? 'bg-gray-800 outline-white/10' : 'bg-white border border-gray-200'
            )}>
              <MenuItem>
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'block px-4 py-2 text-sm',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  React Documentation
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="https://tailwindcss.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'block px-4 py-2 text-sm',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  Tailwind CSS Docs
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="https://vitejs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'block px-4 py-2 text-sm',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  Vite Guide
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="https://github.com/facebook/react/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'block px-4 py-2 text-sm',
                    isDark ? 'text-gray-300 data-focus:bg-white/5' : 'text-gray-700 data-focus:bg-gray-100'
                  )}
                >
                  React Issues
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
          
        </div>
      </div>
    </nav>
  );
}