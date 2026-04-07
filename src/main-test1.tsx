import { createRoot } from 'react-dom/client'
import './index.css'

// Test 1: Basic React with no dependencies
const App = () => {
  console.log('TEST 1: Basic React');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test 1: Basic React Working</h1>
      <p>If you see this, basic React works.</p>
    </div>
  );
};

console.log('Starting Test 1');
createRoot(document.getElementById("root")!).render(<App />);
