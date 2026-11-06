import {describe, expect, it} from 'vitest';
import {normalizeInvoiceProducts} from './invoicePayload';

describe('invoice request product rows', () => {
  const row = {
    ItemId: '',
    ProductId: 'product-1',
    Quantity: '1' as unknown as number,
    SellingPrice: '650' as unknown as number,
    SellingDate: '',
  };

  it('removes UI-only fields from create requests', () => {
    expect(normalizeInvoiceProducts([row], false)).toEqual([
      {ProductId: 'product-1', Quantity: 1, SellingPrice: 650},
    ]);
  });

  it('keeps an existing row id for update requests only', () => {
    expect(
      normalizeInvoiceProducts([{...row, ItemId: 'sale-1'}], true),
    ).toEqual([
      {
        ItemId: 'sale-1',
        ProductId: 'product-1',
        Quantity: 1,
        SellingPrice: 650,
      },
    ]);
  });
});
