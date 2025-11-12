import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import BrowseLessons from './components/BrowseLessons';
import { ThemeProvider } from './context/ThemeContext';


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lessons" element={<BrowseLessons />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App