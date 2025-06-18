import React from 'react';
import ReactDOM from 'react-dom/client';
import CacheSimulator from './CacheSimulator.jsx'; 
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CacheSimulator />
  </React.StrictMode>
);
