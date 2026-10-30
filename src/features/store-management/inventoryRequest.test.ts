import {describe, expect, it} from 'vitest';
import {buildProductionPayload} from './inventoryRequest';

describe('production request mapping', () => {
  it('keeps an optional maker on the corresponding inventory batch', () => {
    expect(buildProductionPayload({ProductionInfo: [
      {ProductId: 'product-1', CurrentQuantity: 10, ProductionAmount: 5, MadeByEmployeeId: 'employee-1'},
      {ProductId: 'product-2', CurrentQuantity: 3, ProductionAmount: 2, MadeByEmployeeId: ''},
    ]}, 'request-1')).toEqual({
      RequestId: 'request-1',
      ProductionInfo: [
        {ProductId: 'product-1', Quantity: 5, MadeByEmployeeId: 'employee-1'},
        {ProductId: 'product-2', Quantity: 2, MadeByEmployeeId: undefined},
      ],
    });
  });
});
