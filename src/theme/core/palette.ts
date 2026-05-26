import type {ColorSystemOptions} from '@mui/material/styles';

import COLORS from './colors.json';
import {createPaletteChannel, varAlpha} from '../styles';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    whiteChannel: string;
    blackChannel: string;
  }
  interface TypeText {
    disabledChannel: string;
  }
  interface TypeBackground {
    neutral: string;
    neutralChannel: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
    lighterChannel: string;
    darkerChannel: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
    lighterChannel: string;
    darkerChannel: string;
  }
}

declare module '@mui/material/styles' {
  interface ThemeVars {
    transitions: Theme['transitions'];
  }
}

declare module '@mui/material' {
  interface Color {
    ['50Channel']: string;
    ['100Channel']: string;
    ['200Channel']: string;
    ['300Channel']: string;
    ['400Channel']: string;
    ['500Channel']: string;
    ['600Channel']: string;
    ['700Channel']: string;
    ['800Channel']: string;
    ['900Channel']: string;
  }
}

export type ColorType =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export const grey = createPaletteChannel(COLORS.grey);
export const primary = createPaletteChannel(COLORS.primary);
export const secondary = createPaletteChannel(COLORS.secondary);
export const info = createPaletteChannel(COLORS.info);
export const success = createPaletteChannel(COLORS.success);
export const warning = createPaletteChannel(COLORS.warning);
export const error = createPaletteChannel(COLORS.error);
export const common = createPaletteChannel(COLORS.common);

const proPrimary = createPaletteChannel({
  lighter: '#D9EAF6',
  light: '#3E79A1',
  main: '#004B7D',
  dark: '#00365A',
  darker: '#002743',
  contrastText: '#FFFFFF',
});

const proSecondary = createPaletteChannel({
  lighter: '#334E68',
  light: '#1C2434',
  main: '#102A43',
  dark: '#1F3B57',
  darker: '#0B1E31',
  contrastText: '#FFFFFF',
});

const lightPrimary = createPaletteChannel({
  lighter: '#DBEAFE',
  light: '#60A5FA',
  main: '#2563EB',
  dark: '#1D4ED8',
  darker: '#1E3A8A',
  contrastText: '#FFFFFF',
});

const lightSecondary = createPaletteChannel({
  lighter: '#CBD5E1',
  light: '#334155',
  main: '#0F172A',
  dark: '#1E293B',
  darker: '#020617',
  contrastText: '#FFFFFF',
});

const text = {
  light: createPaletteChannel({
    primary: '#334155',
    secondary: '#64748B',
    disabled: '#94A3B8',
  }),
  dark: createPaletteChannel({
    primary: '#E2E8F0',
    secondary: '#94A3B8',
    disabled: '#64748B',
  }),
  pro: createPaletteChannel({
    primary: '#243B53',
    secondary: '#52606D',
    disabled: '#9AA5B1',
  }),
};

const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: '#F8FAFC',
    neutral: '#F1F5F9',
  }),
  dark: createPaletteChannel({
    paper: '#111827',
    default: '#0F172A',
    neutral: '#1E293B',
  }),
  pro: createPaletteChannel({
    paper: '#FFFFFF',
    default: '#F4F7FA',
    neutral: '#E9EFF5',
  }),
};

const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const action = {
  light: {
    ...baseAction,
    active: '#64748B',
    hover: '#F1F5F9',
    selected: '#EFF6FF',
    focus: '#EFF6FF',
    disabled: '#64748B',
    disabledBackground: '#CBD5E1',
  },
  dark: {
    ...baseAction,
    active: '#E2E8F0',
    hover: '#334155',
    selected: '#273549',
    focus: '#273549',
    disabled: '#9CA3AF',
    disabledBackground: '#374151',
  },
  pro: {
    ...baseAction,
    active: '#52606D',
    hover: '#EEF3F8',
    selected: '#F0F4F8',
    focus: '#F0F4F8',
    disabled: '#7B8794',
    disabledBackground: '#D6DCE3',
  },
};

const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: '#E2E8F0',
};

export const lightPalette = {
  ...basePalette,
  primary: lightPrimary,
  secondary: lightSecondary,
  warning: createPaletteChannel({
    lighter: '#FEF3C7',
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
    darker: '#92400E',
    contrastText: '#0F172A',
  }),
  text: text.light,
  background: background.light,
  action: action.light,
};

export const darkPalette = {
  ...basePalette,
  divider: '#334155',
  text: text.dark,
  background: background.dark,
  action: action.dark,
  primary: createPaletteChannel({
    lighter: '#DBEAFE',
    light: '#60A5FA',
    main: '#3B82F6',
    dark: '#2563EB',
    darker: '#1D4ED8',
    contrastText: '#FFFFFF',
  }),
  secondary: createPaletteChannel({
    lighter: '#1E293B',
    light: '#111827',
    main: '#020617',
    dark: '#1E293B',
    darker: '#020617',
    contrastText: '#E2E8F0',
  }),
  success: createPaletteChannel({
    lighter: '#D1FAE5',
    light: '#6EE7B7',
    main: '#10B981',
    dark: '#059669',
    darker: '#047857',
    contrastText: '#FFFFFF',
  }),
};

export const proPalette = {
  ...basePalette,
  divider: '#D9E2EC',
  primary: proPrimary,
  secondary: proSecondary,
  warning: createPaletteChannel({
    lighter: '#F8EDC2',
    light: '#E3C567',
    main: '#D4AF37',
    dark: '#B8932F',
    darker: '#8A6E23',
    contrastText: '#1C2434',
  }),
  text: text.pro,
  background: background.pro,
  action: action.pro,
};

export const colorSchemes: Partial<
  Record<'light' | 'dark' | 'pro', ColorSystemOptions>
> = {
  light: {palette: lightPalette},
  dark: {palette: darkPalette},
  pro: {palette: proPalette},
};
