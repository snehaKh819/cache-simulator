import React from 'react';
import ReactDOM from 'react-dom/client';
import { Desktop } from './index.jsx'; // ✅ Fix is here
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Desktop />
  </React.StrictMode>
);
