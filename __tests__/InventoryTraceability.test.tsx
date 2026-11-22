import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import InventoryTraceability from '../src/features/store-management/components/InventoryTraceability';
import {IProduct} from '../src/core/interfaces/api/IProduct';

const apiMocks = vi.hoisted(() => ({
  batches: vi.fn(),
  items: vi.fn(),
  refetchBatches: vi.fn(),
  refetchItems: vi.fn(),
  fetchQr: vi.fn(),
  buildPdf: vi.fn(),
  savePdf: vi.fn(),
}));

vi.mock('../src/core/store/api/product', () => ({
  useListProductBatchesQuery: apiMocks.batches,
  useListBatchItemsQuery: apiMocks.items,
  useLazyListBatchQrCodesQuery: () => [apiMocks.fetchQr],
}));

vi.mock('../src/features/store-management/utils/batchQrPdf', () => ({
  buildBatchQrPdf: apiMocks.buildPdf,
  batchQrFileName: (id: string) => `batch-${id}-qr-codes.pdf`,
}));

const product: IProduct = {
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

const batches = [
  {
    BatchId: 'BATCH-001',
    ProductId: 'product-1',
    QuantityReceived: 12,
    CreatedBy: 'admin-1',
    CreatedDate: '2026-10-25T10:00:00.000Z',
  },
  {
    BatchId: 'BATCH-002',
    ProductId: 'product-1',
    QuantityReceived: 13,
    CreatedBy: 'admin-2',
    CreatedDate: '2026-10-26T10:00:00.000Z',
  },
];

const renderDrawer = (overrides: Partial<IProduct> = {}) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <InventoryTraceability
        product={{...product, ...overrides}}
        onClose={vi.fn()}
      />
    </ThemeProvider>,
  );

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {writeText: vi.fn().mockResolvedValue(undefined)},
  });
  apiMocks.batches.mockImplementation(({Page}) => ({
    currentData: {
      IsSuccess: true,
      Data:
        Page === 1
          ? batches
          : [
              {
                BatchId: 'BATCH-011',
                ProductId: 'product-1',
                QuantityReceived: 3,
                CreatedBy: 'admin-1',
                CreatedDate: '2026-10-26T10:00:00.000Z',
              },
            ],
      TotalCount: 12,
    },
    isFetching: false,
    isError: false,
    refetch: apiMocks.refetchBatches,
  }));
  apiMocks.items.mockImplementation(({BatchId}) => ({
    currentData: {
      IsSuccess: true,
      Data: BatchId
        ? [
            {
              SerialNumber: `${BatchId}_0001`,
              BatchId,
              ProductId: 'product-1',
              UnitIndex: 1,
              CreatedDate: '2026-10-25T10:00:00.000Z',
            },
          ]
        : [],
      TotalCount: BatchId ? 11 : 0,
    },
    isFetching: false,
    isError: false,
    refetch: apiMocks.refetchItems,
  }));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('InventoryTraceability', () => {
  describe('download QR codes', () => {
    const qr = (n: number, start = 1) =>
      Array.from({length: n}, (_, i) => ({
        UnitIndex: start + i,
        QrVerificationUrl: `https://shop.example.com/verify-product/t${start + i}`,
      }));

    beforeEach(() => {
      apiMocks.buildPdf.mockResolvedValue({save: apiMocks.savePdf});
    });

    it('is disabled until QR verification is enabled for the product', async () => {
      renderDrawer({QrVerificationEnabled: false});
      expect(
        await screen.findByRole('button', {name: 'Download QR codes'}),
      ).toBeDisabled();
    });

    it('fetches every page of the batch and saves one PDF named after the batch', async () => {
      apiMocks.fetchQr
        .mockReturnValueOnce({
          unwrap: () => Promise.resolve({IsSuccess: true, Data: qr(2), TotalCount: 3}),
        })
        .mockReturnValueOnce({
          unwrap: () => Promise.resolve({IsSuccess: true, Data: qr(1, 3), TotalCount: 3}),
        });
      renderDrawer({QrVerificationEnabled: true});
      fireEvent.click(
        await screen.findByRole('button', {name: 'Download QR codes'}),
      );
      await waitFor(() => expect(apiMocks.savePdf).toHaveBeenCalledWith('batch-BATCH-001-qr-codes.pdf'));
      expect(apiMocks.fetchQr).toHaveBeenNthCalledWith(1, {BatchId: 'BATCH-001', Page: 1, Size: 500});
      expect(apiMocks.fetchQr).toHaveBeenNthCalledWith(2, {BatchId: 'BATCH-001', Page: 2, Size: 500});
      expect(apiMocks.buildPdf).toHaveBeenCalledWith([
        'https://shop.example.com/verify-product/t1',
        'https://shop.example.com/verify-product/t2',
        'https://shop.example.com/verify-product/t3',
      ]);
      expect(await screen.findByText('Downloaded 3 QR codes')).toBeInTheDocument();
    });

    it('shows the server message when the PDF cannot be prepared', async () => {
      apiMocks.fetchQr.mockReturnValueOnce({
        unwrap: () => Promise.reject({data: {message: 'Enable QR verification for this product'}}),
      });
      renderDrawer({QrVerificationEnabled: true});
      fireEvent.click(
        await screen.findByRole('button', {name: 'Download QR codes'}),
      );
      expect(
        await screen.findByText('Enable QR verification for this product'),
      ).toBeInTheDocument();
      expect(apiMocks.savePdf).not.toHaveBeenCalled();
    });
  });

  it('loads batches, selects one, paginates items and copies an admin-only serial', async () => {
    renderDrawer();

    expect(
      screen.getByRole('heading', {name: 'Premium Net'}),
    ).toBeInTheDocument();
    expect(apiMocks.batches).toHaveBeenCalledWith(
      {ProductId: 'product-1', Page: 1, Size: 10},
      {skip: false},
    );

    expect(await screen.findByText('BATCH-001_0001')).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', {name: 'Copy batch ID BATCH-001'}),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('BATCH-001');
    expect(
      await screen.findByText('Batch ID BATCH-001 copied'),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('listitem', {name: 'Select batch BATCH-002'}),
    );
    expect(await screen.findByText('BATCH-002_0001')).toBeInTheDocument();

    const serialPagination = screen.getByRole('navigation', {
      name: 'Serial item pages',
    });
    fireEvent.click(
      serialPagination.querySelector('button[aria-label="Go to page 2"]')!,
    );
    await waitFor(() =>
      expect(apiMocks.items).toHaveBeenLastCalledWith(
        {BatchId: 'BATCH-002', Page: 2, Size: 10},
        {skip: false},
      ),
    );

    fireEvent.click(
      screen.getByRole('button', {name: 'Copy serial BATCH-002_0001'}),
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'BATCH-002_0001',
    );
    expect(
      await screen.findByText('Serial BATCH-002_0001 copied'),
    ).toBeInTheDocument();
  });

  it('supports batch pagination and replaces the stale batch selection', async () => {
    renderDrawer();
    await screen.findByText('BATCH-001_0001');

    const batchPagination = screen.getByRole('navigation', {
      name: 'Batch pages',
    });
    fireEvent.click(
      batchPagination.querySelector('button[aria-label="Go to page 2"]')!,
    );

    await waitFor(() =>
      expect(apiMocks.batches).toHaveBeenLastCalledWith(
        {ProductId: 'product-1', Page: 2, Size: 10},
        {skip: false},
      ),
    );
    expect(await screen.findByText('BATCH-011_0001')).toBeInTheDocument();
    expect(screen.queryByText('BATCH-001_0001')).not.toBeInTheDocument();
  });

  it('announces clipboard permission failures without rejecting the action', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });
    renderDrawer();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Copy serial BATCH-001_0001',
      }),
    );

    const message = await screen.findByText(
      'Could not copy the serial number. Please copy it manually.',
    );
    expect(message.closest('[role="alert"]')).toBeInTheDocument();
  });

  it('shows and retries a serial-query error for the selected batch', async () => {
    apiMocks.items.mockImplementation(({BatchId}) => ({
      currentData: undefined,
      isFetching: false,
      isError: Boolean(BatchId),
      refetch: apiMocks.refetchItems,
    }));
    renderDrawer();

    expect(
      await screen.findByText('Serial items could not be loaded.'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    expect(apiMocks.refetchItems).toHaveBeenCalledOnce();
  });

  it('shows retry and empty states without exposing stale serial values', () => {
    apiMocks.batches.mockReturnValue({
      currentData: undefined,
      isFetching: false,
      isError: true,
      refetch: apiMocks.refetchBatches,
    });
    apiMocks.items.mockReturnValue({
      currentData: undefined,
      isFetching: false,
      isError: false,
      refetch: apiMocks.refetchItems,
    });
    const view = renderDrawer();

    expect(
      screen.getByText('Batch history could not be loaded.'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    expect(apiMocks.refetchBatches).toHaveBeenCalledOnce();

    view.unmount();
    apiMocks.batches.mockReturnValue({
      currentData: {IsSuccess: true, Data: [], TotalCount: 0},
      isFetching: false,
      isError: false,
      refetch: apiMocks.refetchBatches,
    });
    renderDrawer();
    expect(
      screen.getByText('No inventory batches exist for this product yet.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(/_0001/)).not.toBeInTheDocument();
  });
});
