import {Card, CardContent} from '@mui/material';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CountUp from 'react-countup';
import {useGetDashboardDataQuery} from '@core/store/api/invoiceApi';
import {useEffect, type ReactNode} from 'react';
import CustomTable from '@components/table/CustomTable';
import {getInvoiceColumns} from '@features/invoice/pages/invoice';
import {useAppSelector} from '@core/store/hooks';
import {selectIsWholeSaler} from '@core/store/slices/auth.slice';
import {DashboardSkeleton} from '@components/loaders/AdminSkeleton';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#0ea5e9', '#64748b'];

type MetricCardProps = {
  label: string;
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  prefix?: ReactNode;
};

const toneClass = {
  default: 'text-[var(--palette-text-primary)]',
  success: 'text-[var(--palette-success-main)]',
  warning: 'text-[var(--palette-warning-main)]',
  danger: 'text-[var(--palette-error-main)]',
};

function MetricCard({label, value, tone = 'default', prefix}: MetricCardProps) {
  return (
    <Card className="min-w-0">
      <CardContent>
        <p className="text-sm text-[var(--palette-text-secondary)]">{label}</p>
        <p className={`mt-2 text-2xl font-bold ${toneClass[tone]}`}>
          {prefix}
          <CountUp end={value} duration={2} separator="," decimals={2} />
        </p>
      </CardContent>
    </Card>
  );
}

const Dashboard = () => {
  const {data, isLoading, refetch} = useGetDashboardDataQuery({
    pageNumber: 1,
    pageSize: 10,
    itemId: '',
  });
  const dashBoardData = data?.Data;
  const isWholeSaler = useAppSelector(selectIsWholeSaler);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isWholeSaler) {
    return (
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Invoices this month"
            value={dashBoardData?.ThisMonthTotalInvoice ?? 0}
          />
          <MetricCard
            label="Outstanding due"
            value={dashBoardData?.TotalOutstandingDue ?? 0}
            tone="warning"
            prefix="Tk "
          />
          <MetricCard
            label="Account credit"
            value={dashBoardData?.TotalCustomerCredit ?? 0}
            tone="success"
            prefix="Tk "
          />
        </div>

        <Card>
          <CardContent>
            <h2 className="mb-2 text-lg font-bold">Recent invoices</h2>
            <div className="w-full overflow-x-auto py-4">
                <CustomTable
                  isRowClickable={false}
                  columns={getInvoiceColumns(true)}
                  hidePagination
                  data={dashBoardData?.RecentInvoiceData ?? []}
                  rowsPerPage={10}
                  emptyState={{
                    title: 'No invoices yet',
                    description: 'Your recent wholesaler invoices will appear here.',
                  }}
                />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cashMarginData = dashBoardData?.CashMarginData ?? [];
  const productSales = dashBoardData?.ProductSalesInfo ?? [];
  const wholesalerCollections = dashBoardData?.CashCollectedByWholesaler ?? [];

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Cash collected this month"
          value={dashBoardData?.ThisMonthCashCollected ?? 0}
          tone="success"
          prefix="Tk "
        />
        <MetricCard
          label="Gross profit this month"
          value={dashBoardData?.ThisMonthGrossProfit ?? 0}
          tone="success"
          prefix="Tk "
        />
        <MetricCard
          label="Realized cash margin this month"
          value={dashBoardData?.ThisMonthRealizedCashMargin ?? 0}
          tone={
            (dashBoardData?.ThisMonthRealizedCashMargin ?? 0) >= 0
              ? 'success'
              : 'danger'
          }
          prefix="Tk "
        />
        <MetricCard
          label="Outstanding due"
          value={dashBoardData?.TotalOutstandingDue ?? 0}
          tone="warning"
          prefix="Tk "
        />
        <MetricCard
          label="Cost at risk"
          value={dashBoardData?.TotalCostAtRisk ?? 0}
          tone="danger"
          prefix="Tk "
        />
        <MetricCard
          label="Customer credit"
          value={dashBoardData?.TotalCustomerCredit ?? 0}
          tone="success"
          prefix="Tk "
        />
        <MetricCard
          label="Invoices this month"
          value={dashBoardData?.ThisMonthTotalInvoice ?? 0}
        />
        <MetricCard
          label="Products sold this month"
          value={dashBoardData?.ThisMonthTotalSell ?? 0}
        />
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-1 text-lg font-bold">
            Cash collection and realized margin
          </h2>
          <p className="mb-4 text-sm text-[var(--palette-text-secondary)]">
            Due receipts increase cash and realized margin, but never create
            additional gross profit.
          </p>
          {cashMarginData.length ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={cashMarginData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={value => `Tk ${Number(value).toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cashCollected"
                  name="Cash collected"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="realizedCashMargin"
                  name="Realized cash margin"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-[var(--palette-text-secondary)]">
              No financial activity found.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="mb-2 text-lg font-bold">Top selling products</h2>
            {productSales.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={productSales}>
                  <YAxis type="number" />
                  <XAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="sales" name="Quantity sold" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-[var(--palette-text-secondary)]">
                No product sales found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="mb-2 text-lg font-bold">
              Cash collected by customer
            </h2>
            {wholesalerCollections.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={wholesalerCollections}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label>
                    {wholesalerCollections.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={value => `Tk ${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-16 text-center text-sm text-[var(--palette-text-secondary)]">
                No collections found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-2 text-lg font-bold">Recent invoices</h2>
          <div className="w-full overflow-x-auto py-4">
              <CustomTable
                isRowClickable={false}
                columns={getInvoiceColumns(false)}
                hidePagination
                data={dashBoardData?.RecentInvoiceData ?? []}
                rowsPerPage={10}
                emptyState={{
                  title: 'No invoices yet',
                  description: 'Recent invoices will appear here as sales are recorded.',
                }}
              />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
