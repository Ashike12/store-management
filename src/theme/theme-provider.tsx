import type {} from '@mui/material/themeCssVarsAugmentation';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {Experimental_CssVarsProvider as CssVarsProvider} from '@mui/material/styles';

import {createTheme} from './create-theme';

type Props = {
  children: React.ReactNode;
};

export type AppThemeMode = 'light' | 'dark' | 'pro';

type ThemeModeContextValue = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
};

const ThemeModeContext = React.createContext<ThemeModeContextValue | null>(null);

export function ThemeProvider({children}: Readonly<Props>) {
  const theme = createTheme();
  const [mode, setMode] = React.useState<AppThemeMode>('dark');

  const handleSetMode = React.useCallback((nextMode: AppThemeMode) => {
    setMode(nextMode);
  }, []);

  React.useLayoutEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'pro');
    root.classList.add(mode);
    root.setAttribute('data-mui-color-scheme', mode);
  }, [mode]);

  const contextValue = React.useMemo(
    () => ({mode, setMode: handleSetMode}),
    [mode, handleSetMode],
  );

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="dark"
      disableTransitionOnChange>
      <ThemeModeContext.Provider value={contextValue}>
        <CssBaseline />
        {children}
      </ThemeModeContext.Provider>
    </CssVarsProvider>
  );
}

export function useAppThemeMode() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useAppThemeMode must be used inside ThemeProvider');
  }
  return ctx;
}
