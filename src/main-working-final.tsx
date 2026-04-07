import { createRoot } from 'react-dom/client'
import './index.css'

// FINAL WORKING VERSION - Fixed providers
import Home from "@/pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme.tsx";

const App = () => {
  console.log('FINAL WORKING: Fixed providers');
  
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

console.log('Starting FINAL WORKING VERSION');
createRoot(document.getElementById("root")!).render(<App />);
