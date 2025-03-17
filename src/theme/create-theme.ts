import type {Theme} from '@mui/material/styles';

import {extendTheme} from '@mui/material/styles';

import {
  shadows,
  typography,
  components,
  colorSchemes,
  customShadows,
} from './core';

// ----------------------------------------------------------------------

export function createTheme(): Theme {
  const initialTheme = {
    spacing: [0, 1, 2, 4, 8, 16, 32, 64, 128, 256],
    colorSchemes,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: {borderRadius: 4},
    components: {
      ...components,
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            borderRadius: '16px',
            borderColor: 'transparent',
            backgroundColor: 'white',
          },
        },
      },
    },
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme);

  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[]): boolean {
  const skipGlobalKeys = [
    'mixins',
    'overlays',
    'direction',
    'typography',
    'breakpoints',
    'transitions',
    'cssVarPrefix',
    'unstable_sxConfig',
  ];

  const skipPaletteKeys: {
    [key: string]: string[];
  } = {
    global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
    grey: ['A100', 'A200', 'A400', 'A700'],
    text: ['icon'],
  };

  const isPaletteKey = keys[0] === 'palette';

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some(key => skipKeys?.includes(key));
  }

  return keys.some(key => skipGlobalKeys?.includes(key));
}
