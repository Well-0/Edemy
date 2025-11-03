import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getPageStyles } from '../styles/themeStyles';

export default function Home() {
  const { isDark } = useTheme();

  useEffect(() => {
    console.log('Home page script loaded and DOM ready');
    console.log('Base styles applied to home page');
  }, []);

  const styles = getPageStyles(isDark);

  return (
    <div className={styles.container.className} style={styles.container.style}>
      <div className={styles.card.className} style={styles.card.style}>
        <h1 className={styles.heading}>
          Welcome to Edemy
        </h1>
        <p className={styles.subtitle}>
          Your learning journey starts here
        </p>
      </div>
    </div>
  );
}