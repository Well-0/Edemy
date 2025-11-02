import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPageStyles } from '../styles/themeStyles';

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

  const styles = getPageStyles(isDark);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>
          Welcome to Your Learning Platform
        </h1>
        <p className={styles.subtitle}>
          Start your journey to mastering new skills
        </p>
        <div className={styles.buttonGroup}>
          <button onClick={handleGetStarted} className={styles.buttonPrimary}>
            Get Started
          </button>
          <button onClick={handleBrowseLessons} className={styles.buttonSecondary}>
            Browse Lessons
          </button>
        </div>
      </div>
    </div>
  );
}