import {describe, expect, it} from 'vitest';
import {buildInvoiceBusinessRequest} from './invoiceApi';

describe('invoice sales API contract', () => {
  it('constructs the authenticated salesperson request', () => {
    expect(buildInvoiceBusinessRequest('ListSalesUsers', {})).toEqual({
      url: expect.stringMatching(/\/business\/ListSalesUsers$/),
      method: 'POST',
      body: {},
    });
  });

  it('keeps period, seller and pagination in the sales-history body', () => {
    const body = {
      Period: 'last7Days' as const,
      SoldByUserId: 'admin-2',
      Page: 3,
      Size: 10,
    };

    expect(buildInvoiceBusinessRequest('GetSalesHistory', body)).toEqual({
      url: expect.stringMatching(/\/business\/GetSalesHistory$/),
      method: 'POST',
      body,
    });
  });
});
