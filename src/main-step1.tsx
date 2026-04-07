import { createRoot } from 'react-dom/client'
import './index.css'

// Step 1: Test with providers but no pages
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log('Debug: App with providers rendering');
  
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
          }}>
            <h1 style={{ color: '#007acc', marginBottom: '20px' }}>MediConnect - Providers Test</h1>
            <p>All providers are working correctly!</p>
            
            <div style={{ 
              backgroundColor: '#d4edda', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '20px',
              border: '1px solid #c3e6cb'
            }}>
              <h3>Providers Status:</h3>
              <ul>
                <li>ThemeProvider: Working</li>
                <li>QueryClientProvider: Working</li>
                <li>BrowserRouter: Working</li>
              </ul>
            </div>
            
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '15px', 
              borderRadius: '8px',
              marginTop: '20px',
              border: '1px solid #ffeaa7'
            }}>
              <h3>Next Step:</h3>
              <p>If this works, the issue is with the page components.</p>
            </div>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

console.log('Debug: Starting React app with providers');
createRoot(document.getElementById("root")!).render(<App />)
