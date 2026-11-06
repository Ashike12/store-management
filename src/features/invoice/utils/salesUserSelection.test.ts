import {describe, expect, it} from 'vitest';
import {resolveInitialSalesUserId} from './salesUserSelection';

const users = [
  {
    ItemId: 'admin-1',
    DisplayName: 'Admin One',
    Email: 'admin@example.com',
    Roles: ['admin'],
  },
];

describe('invoice salesperson initial selection', () => {
  it('selects the logged-in user when that user is eligible', () => {
    expect(resolveInitialSalesUserId('admin-1', users)).toBe('admin-1');
  });

  it('requires a manual selection when the logged-in user is not eligible', () => {
    expect(resolveInitialSalesUserId('wholesaler-1', users)).toBe('');
  });
});
