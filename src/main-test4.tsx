import { createRoot } from 'react-dom/client'
import './index.css'

// Test 4: Home with ThemeProvider only
import Home from "@/pages/Home";
import { ThemeProvider } from "@/hooks/useTheme.tsx";

const App = () => {
  console.log('TEST 4: Home with ThemeProvider only');
  
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
};

console.log('Starting Test 4');
createRoot(document.getElementById("root")!).render(<App />);
