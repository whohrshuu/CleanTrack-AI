import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import router from './router';
import useUIStore from './store/uiStore';
import './index.css';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      gcTime: 10 * 60 * 1000,       // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize theme from stored preference
function initTheme() {
  const stored = localStorage.getItem('cleantrack-ui');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      if (state?.theme === 'dark') {
        document.body.classList.add('dark');
      }
    } catch {
      // Ignore parsing errors
    }
  }
}

initTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            borderRadius: '6px',
            padding: '10px 14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: { primary: '#2D6A4F', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#C4483E', secondary: '#fff' },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
