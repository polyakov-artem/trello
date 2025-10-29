import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import '@ant-design/v5-patch-for-react-19';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
