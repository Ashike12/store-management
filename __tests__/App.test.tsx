import {describe, expect, it, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import App from '@app/App';

const mockUseAppSelector = vi.fn();

vi.mock('@core/store/hooks', () => ({
  useAppSelector: () => mockUseAppSelector(),
}));

vi.mock('router/AppRouter', () => ({
  default: () => <div data-testid="app-router">App Router</div>,
}));

vi.mock('router/AuthRouter', () => ({
  default: () => <div data-testid="auth-router">Auth Router</div>,
}));

describe('App routing guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '#/login';
  });

  it('renders app router when logged in', () => {
    mockUseAppSelector.mockReturnValue(true);

    render(<App />);

    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('renders auth router when logged out', () => {
    mockUseAppSelector.mockReturnValue(false);

    render(<App />);

    expect(screen.getByTestId('auth-router')).toBeInTheDocument();
  });
});
