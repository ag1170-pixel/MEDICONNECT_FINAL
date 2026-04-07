import { createRoot } from 'react-dom/client'
import './index.css'

// Force render test - bypass all components
const App = () => {
  console.log('FORCE RENDER: App loaded successfully');
  
  // Add error boundary
  try {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f8ff',
        minHeight: '100vh',
        border: '3px solid #007acc'
      }}>
        <h1 style={{ color: '#007acc', marginBottom: '20px' }}>
          MediConnect - FORCE RENDER v2.0
        </h1>
        
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Deployment Status: SUCCESS</h2>
          <p>If you see this, the deployment is working!</p>
          
          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '15px', 
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px solid #c3e6cb'
          }}>
            <h3>What's Working:</h3>
            <ul>
              <li>React: Rendering</li>
              <li>Vite Build: Complete</li>
              <li>Vercel Deployment: Active</li>
              <li>JavaScript: Executing</li>
            </ul>
          </div>
          
          <button 
            onClick={() => {
              alert('JavaScript and Events Working!');
              console.log('Button clicked successfully');
            }}
            style={{
              backgroundColor: '#007acc',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Test Interactivity
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px',
          marginTop: '20px',
          border: '1px solid #ffeaa7'
        }}>
          <h3>Next Step:</h3>
          <p>If this renders, the issue is with the main App components.</p>
          <p>Time: {new Date().toLocaleString()}</p>
          <p>User Agent: {navigator.userAgent}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RENDER ERROR:', error);
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8d7da' }}>
        <h1>Render Error: {error.message}</h1>
        <pre>{error.stack}</pre>
      </div>
    );
  }
};

console.log('FORCE RENDER: Starting app');
createRoot(document.getElementById("root")!).render(<App />);
