import {describe, expect, it} from 'vitest';
import {
  buildOrdersRequest,
  canAccessOrderFulfillment,
  getValidOrderTransitions,
  isConflictError,
} from '../src/features/orders/orderFulfillment';

describe('order fulfillment console rules', () => {
  it('allows only admins into the fulfillment console', () => {
    expect(canAccessOrderFulfillment(['admin'])).toBe(true);
    expect(canAccessOrderFulfillment(['employee', 'admin'])).toBe(true);
    expect(canAccessOrderFulfillment(['wholesaler'])).toBe(false);
    expect(canAccessOrderFulfillment([])).toBe(false);
  });

  it('builds server-side pagination, filters, search, and inclusive date boundaries', () => {
    const request = buildOrdersRequest({
      page: 3,
      status: 'processing',
      search: '  ORD-100  ',
      from: '2026-10-01',
      to: '2026-10-25',
      needsAction: true,
    });

    expect(request).toEqual({
      Page: 3,
      Size: 10,
      Status: 'processing',
      Search: 'ORD-100',
      From: new Date('2026-10-01T00:00:00.000').toISOString(),
      To: new Date('2026-10-25T23:59:59.999').toISOString(),
      NeedsAction: true,
    });
  });

  it('omits empty optional filters so the API can return all orders', () => {
    expect(
      buildOrdersRequest({
        page: 1,
        status: 'all',
        search: '   ',
        from: '',
        to: '',
        needsAction: false,
      }),
    ).toEqual({Page: 1, Size: 10});
  });

  it('exposes only backend-supported next actions', () => {
    expect(getValidOrderTransitions('pending')).toEqual([
      'confirmed',
      'cancelled',
    ]);
    expect(getValidOrderTransitions('confirmed')).toEqual([
      'processing',
      'cancelled',
    ]);
    expect(getValidOrderTransitions('processing')).toEqual([
      'shipped',
      'cancelled',
    ]);
    expect(getValidOrderTransitions('shipped')).toEqual(['delivered']);
    expect(getValidOrderTransitions('delivered')).toEqual([]);
    expect(getValidOrderTransitions('cancelled')).toEqual([]);
  });

  it('recognizes stale-version conflicts and not generic failures', () => {
    expect(isConflictError({status: 409})).toBe(true);
    expect(isConflictError({status: 500})).toBe(false);
    expect(isConflictError(new Error('network'))).toBe(false);
  });
});
