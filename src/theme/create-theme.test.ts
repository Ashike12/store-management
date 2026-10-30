import {describe, expect, it} from 'vitest';
import {createTheme} from './create-theme';

describe('admin portal spacing theme', () => {
  it('preserves the portal spacing scale used by navigation and dashboard layouts', () => {
    const theme = createTheme();

    expect(theme.spacing(1)).toBe('var(--spacing-1, 1px)');
    expect(theme.spacing(2)).toBe('var(--spacing-2, 2px)');
    expect(theme.spacing(9)).toBe('var(--spacing-9, 256px)');
  });

  it('provides shared dialog and input component styling', () => {
    const theme = createTheme();

    expect(theme.components?.MuiDialogContent).toBeDefined();
    expect(theme.components?.MuiDialogActions).toBeDefined();
    expect(theme.components?.MuiInputLabel).toBeDefined();
  });
});
