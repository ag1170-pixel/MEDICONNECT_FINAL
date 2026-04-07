import { createRoot } from 'react-dom/client'
import './index.css'

// Error Boundary to catch runtime errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          fontFamily: 'Arial, sans-serif',
          minHeight: '100vh'
        }}>
          <h1>Something went wrong!</h1>
          <h2>Error Details:</h2>
          <pre style={{ 
            backgroundColor: '#f5c6cb', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {this.state.error.toString()}
            {this.state.error.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Test with error boundary
import Home from "@/pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme.tsx";

const App = () => {
  console.log('APP WITH ERROR BOUNDARY: Loading');
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

console.log('Starting APP WITH ERROR BOUNDARY');
createRoot(document.getElementById("root")!.render(<App />);
