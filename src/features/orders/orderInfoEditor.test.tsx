import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {describe, expect, it, vi} from 'vitest';
import {OrderDetailsDrawer} from './pages/orders';

const apiMocks = vi.hoisted(() => ({
  detail: vi.fn(),
  transition: vi.fn(),
  update: vi.fn(),
  updateRequest: vi.fn(),
}));

vi.mock('@core/store/api/ordersApi', async importOriginal => ({
  ...(await importOriginal<typeof import('@core/store/api/ordersApi')>()),
  useGetFollowUpOrderQuery: apiMocks.detail,
  useTransitionOrderMutation: apiMocks.transition,
  useUpdateOrderInfoMutation: apiMocks.update,
}));

const order = {
  _id: 'order-1',
  OrderNumber: 'ORD-1001',
  CustomerName: 'Old Name',
  PhoneNumber: '01700000000',
  Address: 'Old address',
  Area: 'Savar',
  District: 'Dhaka',
  Division: 'Dhaka',
  PostCode: '1340',
  DeliveryNotes: '',
  DeliveryZone: 'inside_dhaka',
  Subtotal: 500,
  CouponDiscount: 0,
  TotalAmount: 580,
  ShippingCost: 80,
  OrderStatus: 'pending' as const,
  PaymentStatus: 'unpaid' as const,
  PaymentHandling: 'manual' as const,
  RequiresImmediateAction: true,
  Version: 3,
  Items: [
    {
      ProductId: 'product-1',
      ProductName: 'Mosquito Net',
      Quantity: 1,
      UnitPrice: 500,
    },
  ],
  AuditHistory: [],
};

describe('order information editor', () => {
  it('submits corrected delivery data with the selected contact channel', async () => {
    apiMocks.detail.mockReturnValue({
      currentData: {IsSuccess: true, Data: order},
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    });
    apiMocks.transition.mockReturnValue([vi.fn(), {isLoading: false}]);
    apiMocks.updateRequest.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({IsSuccess: true, Data: order}),
    });
    apiMocks.update.mockReturnValue([
      apiMocks.updateRequest,
      {isLoading: false},
    ]);

    render(
      <ThemeProvider theme={createTheme()}>
        <OrderDetailsDrawer orderId="order-1" onClose={vi.fn()} />
      </ThemeProvider>,
    );

    fireEvent.click(
      await screen.findByRole('button', {name: 'Edit order information'}),
    );
    fireEvent.change(screen.getByLabelText(/Customer name/), {
      target: {value: 'Updated Customer'},
    });
    fireEvent.change(screen.getByLabelText(/Phone number/), {
      target: {value: '01800000000'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Save correction'}));

    await waitFor(() =>
      expect(apiMocks.updateRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          ItemId: 'order-1',
          ExpectedVersion: 3,
          CustomerName: 'Updated Customer',
          PhoneNumber: '01800000000',
          UpdateDoneBy: 'PhoneCall',
        }),
      ),
    );
  });
});
