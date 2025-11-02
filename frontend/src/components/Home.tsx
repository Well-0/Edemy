import { useEffect, useState } from 'react';
import { getPageStyles } from '../styles/themeStyles';

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

  const styles = getPageStyles(isDark);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
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