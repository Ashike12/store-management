import {IAddProductionPayload} from '@core/interfaces/api/IProduct';
import type {IProductionForm} from './components/productionModal';

export const createInventoryRequestId = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
  }

  throw new Error('Secure random number generation is unavailable.');
};

export const createInventoryRequestLifecycle = (
  idFactory: () => string = createInventoryRequestId,
) => {
  let activeRequestId: string | null = null;

  return {
    begin: () => {
      activeRequestId ??= idFactory();
      return activeRequestId;
    },
    end: () => {
      activeRequestId = null;
    },
    current: () => activeRequestId,
  };
};

export const buildProductionPayload = (
  values: IProductionForm,
  requestId: string,
): IAddProductionPayload => ({
  RequestId: requestId,
  ProductionInfo: values.ProductionInfo.filter(item => item.ProductId).map(
    item => ({
      ProductId: item.ProductId,
      Quantity: Number(item.ProductionAmount),
    }),
  ),
});
