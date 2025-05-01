
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import './index.css';
import { Providers } from "./providers";
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Providers>
      <ScrollToTop />
      <App />
    </Providers>
  </React.StrictMode>,
);
