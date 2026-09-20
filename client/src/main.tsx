import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Initialize theme BEFORE first render to avoid flash of wrong theme
import { useThemeStore } from './store/themeStore';
// Trigger rehydration by accessing the store — the onRehydrateStorage callback
// in themeStore.ts will apply the correct dark/light class immediately.
void useThemeStore.getState();

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
