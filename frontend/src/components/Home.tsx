import { useEffect, useState } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    console.log('Home page script loaded and DOM ready');
    console.log('Base styles applied to home page');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-5 overflow-hidden ${
        isDark 
          ? 'bg-[#1a1a1a]' 
          : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'
      }`}
    >
      <div 
        className={`rounded-[20px] p-[60px_40px] text-center max-w-[600px] w-full ${
          isDark 
            ? 'bg-[#2d2d2d] shadow-[0_20px_60px_rgba(0,0,0,0.6)]' 
            : 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
        }`}
      >
        <h1 
          className={`text-[2.5rem] font-bold mb-[15px] ${
            isDark ? 'text-[#e0e0e0]' : 'text-[#2c3e50]'
          }`}
        >
          Welcome to Edemy
        </h1>
        <p 
          className={`text-[1.1rem] mb-[40px] ${
            isDark ? 'text-[#a0a0a0]' : 'text-[#7f8c8d]'
          }`}
        >
          Your learning journey starts here
        </p>
      </div>
    </div>
  );
}