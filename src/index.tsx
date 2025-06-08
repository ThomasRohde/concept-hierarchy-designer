import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './pwa';
import { DB_NAME } from './utils/offlineStorage';
import { checkDatabase } from './utils/dbDiagnostic';

const rootElement = document.getElementById('root');

// Check the database structure and contents
checkDatabase(DB_NAME);

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

