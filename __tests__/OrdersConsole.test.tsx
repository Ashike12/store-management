import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import Orders, {OrdersConsole} from '../src/features/orders/pages/orders';
import {FollowUpOrder} from '../src/core/store/api/ordersApi';

const apiMocks = vi.hoisted(() => ({
  list: vi.fn(),
  detail: vi.fn(),
  transition: vi.fn(),
  refetchList: vi.fn(),
  refetchDetail: vi.fn(),
  isAdmin: true,
}));

vi.mock('@core/store/hooks', () => ({
  useAppSelector: () => apiMocks.isAdmin,
}));

vi.mock('../src/core/store/api/ordersApi', () => ({
  ORDER_STATUSES: [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ],
  useListOrdersQuery: apiMocks.list,
  useGetFollowUpOrderQuery: apiMocks.detail,
  useTransitionOrderMutation: () => [apiMocks.transition, {isLoading: false}],
}));

const order: FollowUpOrder = {
  _id: 'order-1',
  OrderNumber: 'ORD-1001',
  CustomerName: 'Rahim Uddin',
  PhoneNumber: '01712345678',
  Address: '12 Test Road',
  Area: 'Dhanmondi',
  District: 'Dhaka',
  Division: 'Dhaka',
  PostCode: '1209',
  DeliveryNotes: 'Call before delivery',
  TotalAmount: 1280,
  Subtotal: 1200,
  ShippingCost: 80,
  OrderStatus: 'pending',
  PaymentStatus: 'unpaid',
  PaymentHandling: 'manual',
  RequiresImmediateAction: true,
  Version: 4,
  CreatedDate: '2026-10-25T10:00:00.000Z',
  Items: [
    {
      ProductId: 'product-1',
      ProductName: 'Blue mosquito net',
      Quantity: 2,
      UnitPrice: 600,
      Category: 'MosquitoNet',
      CustomOptions: {LeftWidth: '72 inch'},
    },
  ],
  StockMovements: [],
  AuditHistory: [
    {
      From: '',
      To: 'pending',
      By: 'storefront',
      At: '2026-10-25T10:00:00.000Z',
      Note: 'Order placed',
    },
  ],
};

function mount() {
  return render(
    <ThemeProvider theme={createTheme()}>
      <OrdersConsole />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  apiMocks.isAdmin = true;
  apiMocks.list.mockImplementation(() => ({
    currentData: {IsSuccess: true, Data: [order], TotalCount: 11},
    isFetching: false,
    isError: false,
    refetch: apiMocks.refetchList,
  }));
  apiMocks.detail.mockImplementation(() => ({
    currentData: {IsSuccess: true, Data: order},
    isFetching: false,
    isError: false,
    refetch: apiMocks.refetchDetail,
  }));
  apiMocks.transition.mockReturnValue({
    unwrap: vi.fn().mockResolvedValue({IsSuccess: true, Data: order}),
  });
  apiMocks.refetchDetail.mockReturnValue({
    unwrap: vi.fn().mockResolvedValue({IsSuccess: true, Data: order}),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('OrdersConsole', () => {
  it('renders fulfillment data and requests another server page', async () => {
    mount();

    expect(
      screen.getByRole('heading', {name: 'Order fulfillment'}),
    ).toBeInTheDocument();
    expect(screen.getAllByText('ORD-1001').length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', {name: '01712345678'})[0],
    ).toHaveAttribute('href', 'tel:01712345678');

    fireEvent.click(screen.getByRole('button', {name: 'Go to page 2'}));
    await waitFor(() =>
      expect(apiMocks.list).toHaveBeenLastCalledWith(
        {Page: 2, Size: 10},
        {refetchOnMountOrArgChange: true, skip: false},
      ),
    );
  });

  it('shows details and sends the current version for a valid transition', async () => {
    mount();
    fireEvent.click(
      screen.getByRole('button', {name: 'Review order ORD-1001'}),
    );

    expect(await screen.findByText('Call before delivery')).toBeInTheDocument();
    expect(screen.getByText('Blue mosquito net')).toBeInTheDocument();
    expect(screen.getByText('LeftWidth')).toBeInTheDocument();
    expect(
      screen.getByText('No stock movement recorded yet.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Order placed')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {name: 'Start processing'}),
    ).not.toBeInTheDocument();

    fireEvent.change(
      screen.getByRole('textbox', {name: 'Action note (optional)'}),
      {
        target: {value: 'Customer confirmed by phone'},
      },
    );
    fireEvent.click(screen.getByRole('button', {name: 'Confirm order'}));

    await waitFor(() =>
      expect(apiMocks.transition).toHaveBeenCalledWith({
        ItemId: 'order-1',
        Status: 'confirmed',
        ExpectedVersion: 4,
        Note: 'Customer confirmed by phone',
      }),
    );
    expect(
      await screen.findByText('Order moved to confirmed.'),
    ).toBeInTheDocument();
  });

  it('hides stale rows and closes details when the date range becomes invalid', async () => {
    mount();
    fireEvent.click(
      screen.getByRole('button', {name: 'Review order ORD-1001'}),
    );
    expect(await screen.findByText('Call before delivery')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('From'), {
      target: {value: '2026-10-26'},
    });
    fireEvent.change(screen.getByLabelText('To'), {
      target: {value: '2026-10-25'},
    });

    expect(
      await screen.findByText(
        'The “From” date must be on or before the “To” date.',
      ),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByLabelText('Order details')).not.toBeInTheDocument(),
    );
    expect(
      screen.queryByRole('button', {name: 'Review order ORD-1001'}),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('ORD-1001')).not.toBeInTheDocument();
    expect(apiMocks.list).toHaveBeenLastCalledWith(
      expect.objectContaining({
        From: expect.any(String),
        To: expect.any(String),
      }),
      {refetchOnMountOrArgChange: true, skip: true},
    );
  });

  it('requires a reload after conflict and retries with the fresh version', async () => {
    let currentOrder = order;
    apiMocks.detail.mockImplementation(() => ({
      currentData: {IsSuccess: true, Data: currentOrder},
      isFetching: false,
      isError: false,
      refetch: apiMocks.refetchDetail,
    }));
    apiMocks.transition
      .mockReturnValueOnce({unwrap: vi.fn().mockRejectedValue({status: 409})})
      .mockReturnValueOnce({
        unwrap: vi.fn().mockResolvedValue({IsSuccess: true, Data: order}),
      });
    apiMocks.refetchDetail.mockImplementation(() => {
      currentOrder = {...order, Version: 9};
      return {
        unwrap: vi
          .fn()
          .mockResolvedValue({IsSuccess: true, Data: currentOrder}),
      };
    });

    mount();
    fireEvent.click(
      screen.getByRole('button', {name: 'Review order ORD-1001'}),
    );
    fireEvent.click(await screen.findByRole('button', {name: 'Confirm order'}));

    expect(
      await screen.findByText(
        'This order changed or stock is unavailable. Reload it before trying again.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Confirm order'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Cancel order'})).toBeDisabled();

    fireEvent.click(screen.getByRole('button', {name: 'Reload latest order'}));
    await waitFor(() =>
      expect(screen.getByRole('button', {name: 'Confirm order'})).toBeEnabled(),
    );
    fireEvent.click(screen.getByRole('button', {name: 'Confirm order'}));

    await waitFor(() =>
      expect(apiMocks.transition).toHaveBeenLastCalledWith({
        ItemId: 'order-1',
        Status: 'confirmed',
        ExpectedVersion: 9,
        Note: undefined,
      }),
    );
  });

  it('redirects a non-admin away from the orders page without querying orders', async () => {
    apiMocks.isAdmin = false;
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter initialEntries={['/orders']}>
          <Routes>
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/dashboard"
              element={<div>Dashboard destination</div>}
            />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(
      await screen.findByText('Dashboard destination'),
    ).toBeInTheDocument();
    expect(apiMocks.list).not.toHaveBeenCalled();
  });
});
