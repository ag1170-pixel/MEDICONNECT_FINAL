import { createRoot } from 'react-dom/client'
import './index.css'

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MediConnect Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        backgroundColor: '#007acc', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        Test Element
      </div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
