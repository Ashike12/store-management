import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import '@core/services/i18n.service';
import FontLoaderApp from '@app/FontLoaderApp.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FontLoaderApp />
  </StrictMode>,
);
