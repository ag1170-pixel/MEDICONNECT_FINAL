import { createRoot } from 'react-dom/client'
import './index.css'

// Debug version to identify deployment issues
const App = () => {
  console.log('Debug: App component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#007acc', marginBottom: '20px' }}>MediConnect Debug Mode</h1>
      <p>If you can see this, the basic React setup is working!</p>
      
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Deployment Status Check:</h2>
        <ul>
          <li>React: Working</li>
          <li>Vite Build: Working</li>
          <li>Vercel Deployment: Working</li>
        </ul>
        
        <button 
          onClick={() => alert('JavaScript is working!')}
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
          Test JavaScript
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ffeaa7'
      }}>
        <h3>Next Steps:</h3>
        <p>If this page loads, the issue is with the full application components.</p>
        <p>Check browser console for specific errors.</p>
      </div>
    </div>
  )
}

console.log('Debug: Starting React app');
createRoot(document.getElementById("root")!).render(<App />)
