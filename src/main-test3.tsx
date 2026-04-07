import { createRoot } from 'react-dom/client'
import './index.css'

// Test 3: React with Home component but no providers
import Home from "@/pages/Home";

const App = () => {
  console.log('TEST 3: Home component without providers');
  
  return (
    <div>
      <Home />
    </div>
  );
};

console.log('Starting Test 3');
createRoot(document.getElementById("root")!).render(<App />);
