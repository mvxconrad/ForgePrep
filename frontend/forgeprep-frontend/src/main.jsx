import 'bootswatch/dist/lux/bootstrap.min.css'; // OR minty, cyborg, darkly, etc.
import './index.css'; // Keep this - it imports your CSS with the Tailwind directives
import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);