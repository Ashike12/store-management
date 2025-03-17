import StoreProvider from '@components/providers/StoreProviders';
import useFontLoader from '@core/hooks/useFontLoader';
import {ThemeProvider} from 'theme/theme-provider.tsx';
import App from './App';
import {sfPro} from '@assets/fonts';

function FontLoaderApp() {
  const isFontLoaded = useFontLoader('SF-Pro', sfPro);
  console.log('isFontLoaded -> ', isFontLoaded);

  if (!isFontLoaded) {
    return (
      <div className="min-h-screen content-center text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <StoreProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StoreProvider>
  );
}

export default FontLoaderApp;
