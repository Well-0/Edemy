export const getPageStyles = (isDark: boolean) => ({
  container: `min-h-screen flex items-center justify-center p-5 overflow-hidden ${
    isDark ? 'bg-[#1a1a1a]' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'
  }`,
  
  card: `rounded-[20px] p-[60px_40px] text-center max-w-[600px] w-full ${
    isDark 
      ? 'bg-[#2d2d2d] shadow-[0_20px_60px_rgba(0,0,0,0.6)]' 
      : 'bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
  }`,
  
  heading: `text-[2.5rem] font-bold mb-[15px] ${
    isDark ? 'text-[#e0e0e0]' : 'text-[#2c3e50]'
  }`,
  
  subtitle: `text-[1.1rem] mb-[40px] ${
    isDark ? 'text-[#a0a0a0]' : 'text-[#7f8c8d]'
  }`,
  
  buttonGroup: 'flex gap-[15px] justify-center flex-wrap',
  
  buttonPrimary: 'px-[35px] py-[15px] text-base font-semibold border-none rounded-[10px] cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
  
  buttonSecondary: 'px-[35px] py-[15px] text-base font-semibold border-none rounded-[10px] cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]'
});