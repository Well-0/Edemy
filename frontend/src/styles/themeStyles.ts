export const getPageStyles = (isDark: boolean) => {
  // Define styles based on the theme
  const gradientBg = isDark 
    ? { background: '#1a1a1a' }
    : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  const cardBg = isDark
    ? { background: '#2d2d2d', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }
    : { background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' };

  const headingColor = isDark ? 'text-light' : 'text-dark';
  const subtitleColor = isDark ? 'text-secondary' : 'text-muted';

  // Dark Reader-style filter for buttons
  const buttonSaturation = 'brightness(0.9) contrast(1.1) saturate(1.0)';

  return {
    container: {
      className: 'min-vh-100 d-flex align-items-center justify-content-center p-3',
      style: gradientBg
    },
    card: {
      className: 'text-center rounded-4 p-5',
      style: { ...cardBg, maxWidth: '600px', width: '100%' }
    },
    heading: `display-4 fw-bold mb-3 ${headingColor}`,
    subtitle: `fs-5 mb-4 ${subtitleColor}`,
    buttonGroup: 'd-flex gap-3 justify-content-center flex-wrap',
    buttonPrimary: {
      className: 'btn btn-lg px-4',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.2s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        filter: buttonSaturation
      }
    },
    buttonSecondary: {
      className: 'btn btn-lg px-4',
      style: {
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        border: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.2s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        filter: buttonSaturation
      }
    }
  };
};