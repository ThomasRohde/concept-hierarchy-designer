import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './pwa';
import { migrateLocalStorageToIndexedDB } from './utils/offlineStorage';

// Migrate any existing data stored in localStorage to IndexedDB for offline use
migrateLocalStorageToIndexedDB();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();

