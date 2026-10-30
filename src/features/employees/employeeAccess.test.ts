import {describe, expect, it} from 'vitest';
import {
  allowedEmployeeRoutePaths,
  authenticatedHomePath,
  canManageEmployees,
  isEmployeeRole,
} from './employeeAccess';

describe('employee portal access', () => {
  it('lands employees on their isolated workspace', () => {
    const roles = ['appuser', 'employee'];
    expect(isEmployeeRole(roles)).toBe(true);
    expect(authenticatedHomePath(roles)).toBe('/employee-portal');
    expect([...allowedEmployeeRoutePaths(roles)!]).toEqual(['/employee-portal']);
  });

  it('keeps employee management admin-only', () => {
    expect(canManageEmployees(['employee'])).toBe(false);
    expect(canManageEmployees(['admin'])).toBe(true);
    expect(authenticatedHomePath(['admin'])).toBe('/dashboard');
    expect(allowedEmployeeRoutePaths(['admin'])).toBeNull();
  });
});
