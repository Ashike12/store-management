import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import ProductQrManager from '../src/features/store-management/components/ProductQrManager';
import {IProduct, ProductQrAction} from '../src/core/interfaces/api/IProduct';

const apiMocks = vi.hoisted(() => ({configure: vi.fn()}));

vi.mock('../src/core/store/api/product', () => ({
  useConfigureProductQrMutation: () => [apiMocks.configure, {isLoading: false}],
}));

const baseProduct: IProduct = {
  ItemId: 'product-1',
  ProductName: 'Premium Net',
  Category: 'MosquitoNet',
  SubCategory: 'Double',
  Description: 'Test product',
  ImageLinks: [],
  VideoLink: '',
  MakingPrice: 100,
  WholeSalerPrice: 120,
  EndUserPrice: 180,
  EndUserDiscountedPrice: 160,
  Quantity: 25,
};

const renderManager = (product: IProduct) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <ProductQrManager
        product={product}
        onClose={vi.fn()}
        onUpdated={vi.fn()}
      />
    </ThemeProvider>,
  );

beforeEach(() => {
  apiMocks.configure.mockReset();
  apiMocks.configure.mockImplementation(
    ({ItemId, Action}: {ItemId: string; Action: ProductQrAction}) => ({
      unwrap: async () => ({
        IsSuccess: true,
        Data: {
          ItemId,
          QrVerificationEnabled: Action !== 'disable',
          QrVerificationUrl:
            Action === 'disable'
              ? null
              : 'https://shop.example.com/verify-product/new-token',
        },
      }),
    }),
  );
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {writeText: vi.fn().mockResolvedValue(undefined)},
  });
});

describe('ProductQrManager', () => {
  it('enables an opted-in product and displays its QR label', async () => {
    renderManager(baseProduct);
    fireEvent.click(
      screen.getByRole('button', {name: 'Enable QR verification'}),
    );

    await waitFor(() =>
      expect(apiMocks.configure).toHaveBeenCalledWith({
        ItemId: 'product-1',
        Action: 'enable',
      }),
    );
    expect(await screen.findByTitle('Verify Premium Net')).toBeInTheDocument();
    expect(
      screen.getByText('https://shop.example.com/verify-product/new-token'),
    ).toBeInTheDocument();
  });

  it('copies, rotates and disables an existing label', async () => {
    renderManager({
      ...baseProduct,
      QrVerificationEnabled: true,
      QrVerificationUrl: 'https://shop.example.com/verify-product/old-token',
    });

    fireEvent.click(screen.getByRole('button', {name: 'Copy link'}));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://shop.example.com/verify-product/old-token',
      ),
    );

    fireEvent.click(screen.getByRole('button', {name: 'Rotate code'}));
    await waitFor(() =>
      expect(apiMocks.configure).toHaveBeenCalledWith({
        ItemId: 'product-1',
        Action: 'rotate',
      }),
    );

    fireEvent.click(screen.getByRole('button', {name: 'Disable'}));
    await waitFor(() =>
      expect(apiMocks.configure).toHaveBeenCalledWith({
        ItemId: 'product-1',
        Action: 'disable',
      }),
    );
    expect(
      await screen.findByText('Verification disabled'),
    ).toBeInTheDocument();
  });
});
