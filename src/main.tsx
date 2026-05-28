import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {StyledEngineProvider} from '@mui/material/styles';
import './index.css';
import App from './app/App.tsx';
import AppLoader from './app/AppLoader.tsx';
import '@core/services/i18n.service';
import {ThemeProvider} from 'theme/theme-provider.tsx';
import StoreProvider from '@components/providers/StoreProviders.tsx';

const AdminBootstrap = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 1400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!isReady) {
    return <AppLoader />;
  }

  return (
    <StoreProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </StoreProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminBootstrap />
  </StrictMode>,
);
