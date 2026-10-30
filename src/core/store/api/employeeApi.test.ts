import {describe, expect, it} from 'vitest';
import {buildEmployeeRequest} from './employeeApi';

describe('employee API contract', () => {
  it('targets the protected employee controller with POST bodies', () => {
    expect(buildEmployeeRequest('GetOverview', {EmployeeId: 'employee-1'})).toEqual({
      url: expect.stringMatching(/\/employee\/GetOverview$/),
      method: 'POST',
      body: {EmployeeId: 'employee-1'},
    });
  });
});
