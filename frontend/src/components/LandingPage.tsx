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
    <div className={styles.container.className} style={styles.container.style}>
      <div className={styles.card.className} style={styles.card.style}>
        <h1 className={styles.heading}>
          Welcome to Your Learning Platform
        </h1>
        <p className={styles.subtitle}>
          Start your journey to mastering new skills
        </p>
        <div className={styles.buttonGroup}>
          <button 
            onClick={handleGetStarted} 
            className={styles.buttonPrimary.className}
            style={styles.buttonPrimary.style}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Get Started
          </button>
          <button 
            onClick={handleBrowseLessons} 
            className={styles.buttonSecondary.className}
            style={styles.buttonSecondary.style}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Browse Lessons
          </button>
        </div>
      </div>
    </div>
  );
}