import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    console.log('Applying theme');
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('Theme changed to:', e.matches ? 'dark' : 'light');
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    console.log('Theme applied');

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleGetStarted = () => {
    console.log('Loading Home Page');
    navigate('/home');
  };

  const handleBrowseLessons = () => {
    console.log('Browse Lessons clicked');
    alert('Browse Lessons button clicked!');
  };

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
          Welcome to Your Learning Platform
        </h1>
        <p 
          className={`text-[1.1rem] mb-[40px] ${
            isDark ? 'text-[#a0a0a0]' : 'text-[#7f8c8d]'
          }`}
        >
          Start your journey to mastering new skills
        </p>
        <div className="flex gap-[15px] justify-center flex-wrap">
          <button
            onClick={handleGetStarted}
            className="px-[35px] py-[15px] text-base font-semibold border-none rounded-[10px] cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
          >
            Get Started
          </button>
          <button
            onClick={handleBrowseLessons}
            className="px-[35px] py-[15px] text-base font-semibold border-none rounded-[10px] cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
          >
            Browse Lessons
          </button>
        </div>
      </div>
    </div>
  );
}