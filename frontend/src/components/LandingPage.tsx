import { useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';

import { getPageStyles } from '../styles/themeStyles';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleGetStarted = () => {
    console.log('Loading Home Page');
    navigate('/home');
  };

  const handleBrowseLessons = () => {
    console.log('Loading Lessons Page');
    navigate('/lessons');
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