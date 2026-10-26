import {afterEach, describe, expect, it, vi} from 'vitest';
import {
  buildProductionPayload,
  createInventoryRequestId,
  createInventoryRequestLifecycle,
} from '../src/features/store-management/inventoryRequest';
import {addProductionValidationSchema} from '../src/features/store-management/schemas/add-production.schema';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('inventory request helpers', () => {
  it('creates a collision-resistant request ID', () => {
    const randomUUID = vi.fn().mockReturnValue('request-uuid');
    vi.stubGlobal('crypto', {randomUUID});

    expect(createInventoryRequestId()).toBe('request-uuid');
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it('uses crypto.getRandomValues when randomUUID is unavailable', () => {
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.forEach((_value, index) => {
        bytes[index] = index;
      });
      return bytes;
    });
    vi.stubGlobal('crypto', {getRandomValues});

    expect(createInventoryRequestId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(getRandomValues).toHaveBeenCalledOnce();
  });

  it('retains an ID for retries and regenerates after a completed or cancelled session', () => {
    const idFactory = vi
      .fn()
      .mockReturnValueOnce('request-1')
      .mockReturnValueOnce('request-2')
      .mockReturnValueOnce('request-3');
    const lifecycle = createInventoryRequestLifecycle(idFactory);

    expect(lifecycle.begin()).toBe('request-1');
    expect(lifecycle.begin()).toBe('request-1');
    expect(lifecycle.current()).toBe('request-1');

    lifecycle.end();
    expect(lifecycle.current()).toBeNull();
    expect(lifecycle.begin()).toBe('request-2');

    lifecycle.end();
    expect(lifecycle.begin()).toBe('request-3');
    expect(idFactory).toHaveBeenCalledTimes(3);
  });

  it('sends the amount added rather than the resulting catalog quantity', () => {
    expect(
      buildProductionPayload(
        {
          ProductionInfo: [
            {
              ProductId: 'product-1',
              CurrentQuantity: 125,
              ProductionAmount: 25,
            },
            {ProductId: '', CurrentQuantity: 50, ProductionAmount: 10},
          ],
        },
        'request-1',
      ),
    ).toEqual({
      RequestId: 'request-1',
      ProductionInfo: [{ProductId: 'product-1', Quantity: 25}],
    });
  });

  it('accepts a positive intake for a product whose current stock is zero', async () => {
    await expect(
      addProductionValidationSchema.validate({
        ProductionInfo: [
          {ProductId: 'product-1', CurrentQuantity: 0, ProductionAmount: 5},
        ],
      }),
    ).resolves.toBeTruthy();
  });
});
