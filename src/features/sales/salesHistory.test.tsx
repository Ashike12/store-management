import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import BASE_ROUTES from '@core/config/base-routes';
import {SALES_PERIODS} from './salesPeriods';
import {ThemeProvider} from '../../theme/theme-provider';
import SalesHistory from './pages/salesHistory';

const apiMocks = vi.hoisted(() => ({
  sellers: vi.fn(),
  history: vi.fn(),
  refetchSellers: vi.fn(),
  refetchHistory: vi.fn(),
}));

vi.mock('@core/store/api/invoiceApi', () => ({
  useListSalesUsersQuery: apiMocks.sellers,
  useGetSalesHistoryQuery: apiMocks.history,
}));

const emptyReport = {
  IsSuccess: true,
  TotalCount: 0,
  Data: [],
  Summary: {
    Period: 'daily' as const,
    StartDate: '2026-11-06T00:00:00+06:00',
    EndDateExclusive: '2026-11-07T00:00:00+06:00',
    InvoiceCount: 0,
    TotalSales: 0,
    TotalReceived: 0,
    OutstandingDue: 0,
    GrossProfit: 0,
    SalesByPerson: [],
    DailyTrend: [],
  },
};

const renderPage = () =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <SalesHistory />
      </MemoryRouter>
    </ThemeProvider>,
  );

beforeEach(() => {
  apiMocks.sellers.mockReturnValue({
    data: {
      IsSuccess: true,
      TotalCount: 1,
      Data: [
        {
          ItemId: 'admin-1',
          DisplayName: 'Admin With A Long Display Name',
          Email: 'admin@example.com',
          Roles: ['admin'],
        },
      ],
    },
    isError: false,
    refetch: apiMocks.refetchSellers,
  });
  apiMocks.history.mockReturnValue({
    currentData: emptyReport,
    isFetching: false,
    isError: false,
    refetch: apiMocks.refetchHistory,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('sales history navigation and periods', () => {
  it('uses Today as the first/default period option', () => {
    expect(SALES_PERIODS[0]).toMatchObject({value: 'daily', label: 'Today'});
  });

  it('provides all server-supported preset periods', () => {
    expect(SALES_PERIODS.map(period => period.value)).toEqual([
      'daily',
      'last7Days',
      'last30Days',
      'currentMonth',
    ]);
  });

  it('registers the sales history route', () => {
    expect(BASE_ROUTES.some(route => route.path === '/sales-history')).toBe(true);
  });

  it('shows the default All sellers scope in the closed filter', () => {
    renderPage();

    expect(screen.getByRole('combobox', {name: 'Sold by'})).toHaveTextContent(
      'All sellers',
    );
  });

  it('requests the newly selected preset period', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', {name: /current month/i}));

    await waitFor(() =>
      expect(apiMocks.history).toHaveBeenLastCalledWith(
        expect.objectContaining({Period: 'currentMonth', Page: 1}),
      ),
    );
  });

  it('does not present zero totals or an empty ledger as valid data after a failed report', () => {
    apiMocks.history.mockReturnValue({
      currentData: undefined,
      isFetching: false,
      isError: true,
      refetch: apiMocks.refetchHistory,
    });

    renderPage();

    expect(screen.getByRole('alert')).toHaveTextContent(
      /no totals are shown/i,
    );
    expect(screen.queryByText('Sales ledger')).not.toBeInTheDocument();
    expect(screen.queryByText('No product sales in this period')).not.toBeInTheDocument();
  });
});
