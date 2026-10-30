import {describe, expect, it} from 'vitest';
import {
  buildCreatePaymentPayload,
  buildCreateWorkPayload,
  buildUpdatePaymentPayload,
  buildUpdateWorkPayload,
} from './employeeLedgerPayload';

const form = {
  date: '2026-10-30',
  amount: '1050',
  description: 'Gramee check 5 than',
  reference: 'BAT72810BD0244B4DAAA37D843E7717A6EA',
};

describe('employee ledger payloads', () => {
  it('includes EmployeeId only when creating work', () => {
    expect(buildCreateWorkPayload('employee-1', form)).toEqual(expect.objectContaining({
      EmployeeId: 'employee-1',
      BatchId: form.reference,
      Amount: 1050,
    }));

    const update = buildUpdateWorkPayload('work-1', form);
    expect(update).toEqual(expect.objectContaining({ItemId: 'work-1', BatchId: form.reference}));
    expect(update).not.toHaveProperty('EmployeeId');
  });

  it('includes EmployeeId only when creating payments', () => {
    expect(buildCreatePaymentPayload('employee-1', form)).toHaveProperty('EmployeeId', 'employee-1');
    expect(buildUpdatePaymentPayload('payment-1', form)).not.toHaveProperty('EmployeeId');
  });
});
