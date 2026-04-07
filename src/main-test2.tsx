import { createRoot } from 'react-dom/client'
import './index.css'

// Test 2: Basic React with CSS
const App = () => {
  console.log('TEST 2: React with CSS');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Test 2: React with CSS</h1>
        <p className="text-muted-foreground">If you see this with styling, CSS is working.</p>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Card Component Test</h2>
          <p className="text-sm text-muted-foreground">This should look like a card if CSS is working.</p>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

console.log('Starting Test 2');
createRoot(document.getElementById("root")!).render(<App />);
