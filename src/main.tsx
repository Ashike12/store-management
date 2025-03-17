import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';
import '@core/services/i18n.service';
import {ThemeProvider} from 'theme/theme-provider.tsx';
import StoreProvider from '@components/providers/StoreProviders.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreProvider>
  </StrictMode>,
);
