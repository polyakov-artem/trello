import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import { CssBaseline } from '@mui/material';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>
);
