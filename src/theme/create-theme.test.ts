import {describe, expect, it} from 'vitest';
import {createTheme} from './create-theme';

describe('admin portal spacing theme', () => {
  it('uses the standard MUI spacing rhythm for forms and layouts', () => {
    const theme = createTheme();

    expect(theme.spacing(1)).toBe('calc(1 * var(--spacing, 8px))');
    expect(theme.spacing(2)).toBe('calc(2 * var(--spacing, 8px))');
    expect(theme.spacing(3)).toBe('calc(3 * var(--spacing, 8px))');
  });

  it('provides shared dialog and input component styling', () => {
    const theme = createTheme();

    expect(theme.components?.MuiDialogContent).toBeDefined();
    expect(theme.components?.MuiDialogActions).toBeDefined();
    expect(theme.components?.MuiInputLabel).toBeDefined();
  });
});
