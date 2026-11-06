import {IProductSellInfo} from '@core/interfaces/api/IInvoice';

export const normalizeInvoiceProducts = (
  products: IProductSellInfo[],
  includeItemId: boolean,
): IProductSellInfo[] =>
  products.map(product => ({
    ProductId: product.ProductId,
    Quantity: Number(product.Quantity),
    SellingPrice: Number(product.SellingPrice),
    ...(includeItemId && product.ItemId ? {ItemId: product.ItemId} : {}),
  }));
