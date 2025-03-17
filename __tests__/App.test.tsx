import {describe, vi, beforeEach, afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';

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
});
