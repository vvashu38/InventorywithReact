import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // If you have any global CSS
import App from './App';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
