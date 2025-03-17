import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen, cleanup} from '@testing-library/react';
import App from '@app/App';
import * as AuthModule from '@core/utils/auth'; // Import the module containing getIsLogin

// Mock the layouts
vi.mock('@layout/BaseLayout', () => ({
  default: () => <div data-testid="base-layout">Base Layout</div>,
}));

vi.mock('@layout/AuthLayout', () => ({
  default: () => <div data-testid="auth-layout">Auth Layout</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    cleanup(); // Ensure a clean state before each test
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore mocks after each test
  });

  it('renders BaseLayout when user is logged in', () => {
    vi.spyOn(AuthModule, 'getIsLogin').mockReturnValue(true); // Mock getIsLogin

    render(<App />);

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
  });

  it('renders AuthLayout when user is not logged in', () => {
    vi.spyOn(AuthModule, 'getIsLogin').mockReturnValue(false); // Mock getIsLogin

    render(<App />);

    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
  });
});
