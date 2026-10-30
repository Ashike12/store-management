import {Provider} from 'react-redux';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {ThemeProvider} from '../../theme/theme-provider';
import {store} from '@core/store/store';
import {updateLanguage} from '@core/store/slices/language.slice';
import i18n from '@core/services/i18n.service';
import LanguageSwitcher from './LanguageSwitcher';

const renderSwitcher = () => render(
  <Provider store={store}>
    <ThemeProvider>
      <LanguageSwitcher />
    </ThemeProvider>
  </Provider>,
);

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await act(async () => {
      store.dispatch(updateLanguage('en'));
      await i18n.changeLanguage('en');
    });
  });

  afterEach(async () => {
    await act(async () => {
      store.dispatch(updateLanguage('en'));
      await i18n.changeLanguage('en');
    });
  });

  it('defaults to English and offers all supported portal languages', () => {
    renderSwitcher();

    const switcher = screen.getByRole('combobox', {name: 'Portal language'});
    expect(switcher).toHaveTextContent('English');
    fireEvent.mouseDown(switcher);

    expect(screen.getByRole('option', {name: 'English'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: /বাংলা Bengali/})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: /中文 Chinese/})).toBeInTheDocument();
  });

  it('changes and persists the active language', async () => {
    renderSwitcher();

    fireEvent.mouseDown(screen.getByRole('combobox', {name: 'Portal language'}));
    fireEvent.click(screen.getByRole('option', {name: /বাংলা Bengali/}));

    await waitFor(() => expect(i18n.resolvedLanguage).toBe('bn'));
    expect(store.getState().persisted.language.selection).toBe('bn');
    expect(document.documentElement.lang).toBe('bn');
  });
});
