import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import Dashboard from '@features/dashboard/pages/dashboard';
import type {ReactNode} from 'react';

const mocks = vi.hoisted(() => ({
  isWholesaler: false,
  dashboardData: {} as Record<string, unknown>,
  refetch: vi.fn(),
}));

vi.mock('@core/store/hooks', () => ({
  useAppSelector: () => mocks.isWholesaler,
}));

vi.mock('@core/store/api/invoiceApi', () => ({
  useGetDashboardDataQuery: () => ({
    data: {Data: mocks.dashboardData},
    refetch: mocks.refetch,
  }),
}));

vi.mock('react-countup', () => ({
  default: ({end}: {end: number}) => <span>{end}</span>,
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  LineChart: ({children}: {children: ReactNode}) => <div>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({children}: {children: ReactNode}) => <div>{children}</div>,
  Bar: () => null,
  PieChart: ({children}: {children: ReactNode}) => <div>{children}</div>,
  Pie: ({children}: {children: ReactNode}) => <div>{children}</div>,
  Cell: () => null,
}));

vi.mock('@components/table/CustomTable', () => ({
  default: () => <div data-testid="invoice-table" />,
}));

describe('due-payment reporting dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isWholesaler = false;
    mocks.dashboardData = {
      ThisMonthCashCollected: 160,
      ThisMonthGrossProfit: 100,
      ThisMonthRealizedCashMargin: -40,
      TotalOutstandingDue: 140,
      TotalCustomerCredit: 0,
      TotalCostAtRisk: 40,
      ThisMonthTotalInvoice: 2,
      ThisMonthTotalSell: 2,
      CashMarginData: [
        {date: '2026-10-25', cashCollected: 160, realizedCashMargin: -40},
      ],
      ProductSalesInfo: [],
      CashCollectedByWholesaler: [],
      RecentInvoiceData: [],
    };
  });

  it('shows cash collection, gross profit and realized margin as separate admin metrics', () => {
    render(<Dashboard />);

    expect(
      screen.getByText('Cash collected this month').parentElement,
    ).toHaveTextContent('Tk 160');
    expect(
      screen.getByText('Gross profit this month').parentElement,
    ).toHaveTextContent('Tk 100');
    expect(
      screen.getByText('Realized cash margin this month').parentElement,
    ).toHaveTextContent('Tk -40');
    expect(screen.getByText('Outstanding due').parentElement).toHaveTextContent(
      'Tk 140',
    );
    expect(screen.getByText('Cost at risk').parentElement).toHaveTextContent(
      'Tk 40',
    );
    expect(screen.queryByText('This month revenue')).not.toBeInTheDocument();
    expect(mocks.refetch).toHaveBeenCalledOnce();
  });

  it('keeps private profit and cost metrics out of the wholesaler dashboard', () => {
    mocks.isWholesaler = true;
    mocks.dashboardData = {
      ThisMonthTotalInvoice: 2,
      TotalOutstandingDue: 140,
      TotalCustomerCredit: 0,
      RecentInvoiceData: [],
    };

    render(<Dashboard />);

    expect(screen.getByText('Outstanding due')).toBeInTheDocument();
    expect(
      screen.queryByText('Gross profit this month'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Realized cash margin this month'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Cost at risk')).not.toBeInTheDocument();
  });
});
