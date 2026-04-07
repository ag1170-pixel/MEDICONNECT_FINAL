import { createRoot } from 'react-dom/client'
import './index.css'

// ULTIMATE SIMPLE TEST - No imports, no providers, just basic HTML
const App = () => {
  console.log('ULTIMATE TEST: Loading');
  
  // Add window error handler
  window.addEventListener('error', (event) => {
    console.error('Window error:', event.error);
    document.body.innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; font-family: Arial;">
        <h1>JavaScript Error Detected!</h1>
        <pre>${event.error?.toString() || 'Unknown error'}</pre>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  });
  
  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    document.body.innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; font-family: Arial;">
        <h1>Promise Rejection Detected!</h1>
        <pre>${event.reason?.toString() || 'Unknown rejection'}</pre>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  });
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      border: '3px solid #007acc'
    }}>
      <h1 style={{ color: '#007acc', marginBottom: '20px' }}>
        MediConnect - ULTIMATE TEST
      </h1>
      
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>If you can see this, the deployment is working!</h2>
        <p>Time: {new Date().toLocaleString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>URL: {window.location.href}</p>
        
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
            <li>JavaScript: Executing</li>
            <li>Styles: Applied</li>
            <li>Deployment: Active</li>
          </ul>
        </div>
        
        <button 
          onClick={() => {
            alert('JavaScript events are working!');
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
          Test JavaScript Events
        </button>
      </div>
    </div>
  );
};

console.log('Starting ULTIMATE TEST');
createRoot(document.getElementById("root")!).render(<App />);
