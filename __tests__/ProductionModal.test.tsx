import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ProductionModal from '../src/features/store-management/components/productionModal';

const apiMocks = vi.hoisted(() => ({
  addProduction: vi.fn(),
  refetch: vi.fn(),
}));

vi.mock('../src/core/store/api/product', () => ({
  useGetProductQuery: () => ({
    data: {
      IsSuccess: true,
      TotalCount: 1,
      Data: [
        {
          ItemId: 'product-zero',
          ProductName: 'Zero stock net',
          Quantity: 0,
        },
      ],
    },
    isLoading: false,
    refetch: apiMocks.refetch,
  }),
  useAddProductionMutation: () => [apiMocks.addProduction, {isLoading: false}],
}));

vi.mock('../src/core/store/api/employeeApi', () => ({
  useListEmployeesQuery: () => ({
    data: {
      IsSuccess: true,
      TotalCount: 1,
      Data: [{ItemId: 'employee-1', DisplayName: 'Net Maker'}],
    },
    isLoading: false,
  }),
}));

vi.mock('@components/button/CustomButton', () => ({
  CustomButton: ({
    text,
    loading,
    disabled,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string;
    loading?: boolean;
  }) => (
    <button {...props} disabled={disabled || loading}>
      {text}
    </button>
  ),
}));

vi.mock('@components/text/TextWrapper', () => ({
  default: ({content}: {content: string}) => <h2>{content}</h2>,
}));

const renderModal = (handleClose = vi.fn()) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <ProductionModal isOpen handleClose={handleClose} />
    </ThemeProvider>,
  );

beforeEach(() => {
  vi.spyOn(globalThis.crypto, 'randomUUID')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
    .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');
  apiMocks.refetch.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('ProductionModal inventory request lifecycle', () => {
  it('submits a zero-stock intake, reuses the ID after failure, and renews it for a new modal session', async () => {
    const firstUnwrap = vi
      .fn()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({IsSuccess: true});
    apiMocks.addProduction.mockReturnValue({unwrap: firstUnwrap});
    const handleClose = vi.fn();
    const firstView = renderModal(handleClose);

    fireEvent.mouseDown(screen.getByLabelText('Product ID'));
    fireEvent.click(
      await screen.findByRole('option', {name: 'Zero stock net'}),
    );
    fireEvent.change(screen.getByLabelText('ProductionAmount'), {
      target: {value: '5'},
    });

    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    await waitFor(() =>
      expect(apiMocks.addProduction).toHaveBeenCalledTimes(1),
    );
    expect(
      await screen.findByText(
        'Production could not be saved. Please try again.',
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));
    await waitFor(() =>
      expect(apiMocks.addProduction).toHaveBeenCalledTimes(2),
    );

    const firstPayload = {
      payload: {
        RequestId: '00000000-0000-4000-8000-000000000001',
        ProductionInfo: [{ProductId: 'product-zero', Quantity: 5}],
      },
    };
    expect(apiMocks.addProduction).toHaveBeenNthCalledWith(1, firstPayload);
    expect(apiMocks.addProduction).toHaveBeenNthCalledWith(2, firstPayload);
    expect(handleClose).toHaveBeenCalledOnce();

    firstView.unmount();
    apiMocks.addProduction.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({IsSuccess: true}),
    });
    renderModal();
    fireEvent.mouseDown(screen.getByLabelText('Product ID'));
    fireEvent.click(
      await screen.findByRole('option', {name: 'Zero stock net'}),
    );
    fireEvent.change(screen.getByLabelText('ProductionAmount'), {
      target: {value: '2'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));

    await waitFor(() =>
      expect(apiMocks.addProduction).toHaveBeenCalledTimes(3),
    );
    expect(apiMocks.addProduction).toHaveBeenLastCalledWith({
      payload: {
        RequestId: '00000000-0000-4000-8000-000000000002',
        ProductionInfo: [{ProductId: 'product-zero', Quantity: 2}],
      },
    });
  });
});
