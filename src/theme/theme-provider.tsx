import type {} from '@mui/material/themeCssVarsAugmentation';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from '@mui/material/styles';

import {createTheme} from './create-theme';

type Props = {
  children: React.ReactNode;
};

export type AppThemeMode = 'light' | 'dark' | 'pro';

type ThemeModeContextValue = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
};

const THEME_MODE_KEY = 'store-admin-theme-mode';

const ThemeModeContext = React.createContext<ThemeModeContextValue | null>(null);

function ThemeModeBridge({mode}: Readonly<{mode: AppThemeMode}>) {
  const {setColorScheme} = useColorScheme();

  React.useEffect(() => {
    setColorScheme(mode as any);
  }, [mode, setColorScheme]);

  return null;
}

export function ThemeProvider({children}: Readonly<Props>) {
  const theme = createTheme();
  const [mode, setMode] = React.useState<AppThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const savedMode = localStorage.getItem(THEME_MODE_KEY) as AppThemeMode | null;
    return savedMode ?? 'light';
  });

  const handleSetMode = React.useCallback((nextMode: AppThemeMode) => {
    setMode(nextMode);
    localStorage.setItem(THEME_MODE_KEY, nextMode);
  }, []);

  const contextValue = React.useMemo(
    () => ({mode, setMode: handleSetMode}),
    [mode, handleSetMode],
  );

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="light"
      disableTransitionOnChange>
      <ThemeModeBridge mode={mode} />
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
