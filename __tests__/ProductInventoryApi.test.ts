import {describe, expect, it} from 'vitest';
import {APP_CONFIG} from '../src/core/config/config';
import {
  buildListBatchItemsRequest,
  buildListProductBatchesRequest,
} from '../src/core/store/api/product';

describe('product inventory API contracts', () => {
  it('constructs the product-batch POST request with pagination intact', () => {
    const payload = {ProductId: 'product-1', Page: 2, Size: 10};

    expect(buildListProductBatchesRequest(payload)).toEqual({
      url: `${APP_CONFIG.businessUrl}/business/ListProductBatches`,
      method: 'POST',
      body: payload,
    });
  });

  it('constructs the batch-items POST request with pagination intact', () => {
    const payload = {BatchId: 'batch-1', Page: 3, Size: 25};

    expect(buildListBatchItemsRequest(payload)).toEqual({
      url: `${APP_CONFIG.businessUrl}/business/ListBatchItems`,
      method: 'POST',
      body: payload,
    });
  });
});
