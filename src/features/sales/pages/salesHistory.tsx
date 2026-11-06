import CustomTable from '@components/table/CustomTable';
import {
  ISalesHistoryRow,
  SalesHistoryPeriod,
} from '@core/interfaces/api/IInvoice';
import {SALES_PERIODS} from '../salesPeriods';
import {
  useGetSalesHistoryQuery,
  useListSalesUsersQuery,
} from '@core/store/api/invoiceApi';
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {varAlpha} from 'theme/styles';
import {
  IconCalendarStats,
  IconCash,
  IconFileInvoice,
  IconReceipt2,
  IconTrendingUp,
  IconWallet,
} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PAGE_SIZE = 10;

const money = (value = 0) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(value);

const compactMoney = (value: number) =>
  new Intl.NumberFormat('en-BD', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const dateLabel = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(date);
};

const inclusiveDateLabel = (exclusiveValue: string) => {
  const date = new Date(exclusiveValue);
  if (Number.isNaN(date.getTime())) return exclusiveValue;
  date.setMilliseconds(date.getMilliseconds() - 1);
  return dateLabel(date.toISOString());
};

const salesColumns = [
  {key: 'InvoiceNumber', label: 'INVOICE'},
  {key: 'CreatedDate', label: 'DATE'},
  {key: 'SoldByUserName', label: 'SOLD BY'},
  {key: 'CustomerName', label: 'CUSTOMER / WHOLESALER'},
  {key: 'TotalDisplay', label: 'TOTAL'},
  {key: 'ReceivedDisplay', label: 'RECEIVED'},
  {key: 'DueDisplay', label: 'DUE'},
];

interface SalesTableRow extends ISalesHistoryRow {
  CustomerName: string;
  TotalDisplay: string;
  ReceivedDisplay: string;
  DueDisplay: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  tone: 'primary' | 'success' | 'warning' | 'neutral';
  icon: React.ReactNode;
  loading?: boolean;
}

function MetricCard({label, value, helper, tone, icon, loading = false}: MetricCardProps) {
  const theme = useTheme();
  const color =
    tone === 'neutral'
      ? theme.vars.palette.text.secondary
      : theme.vars.palette[tone].main;
  const colorChannel =
    tone === 'neutral'
      ? theme.vars.palette.text.secondaryChannel
      : theme.vars.palette[tone].mainChannel;

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        minWidth: 0,
        overflow: 'hidden',
        borderRadius: '14px',
        borderColor: 'divider',
        boxShadow: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          bgcolor: color,
        },
      }}>
      <Box sx={{p: {xs: '16px', sm: '18px'}}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={800}
            sx={{letterSpacing: '0.08em', lineHeight: 1.4}}>
            {label}
          </Typography>
          <Box
            sx={{
              width: '34px',
              height: '34px',
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '10px',
              color,
              bgcolor: varAlpha(colorChannel, 0.12),
            }}>
            {icon}
          </Box>
        </Box>
        {loading ? (
          <Skeleton width="68%" height={36} sx={{mt: '8px'}} />
        ) : (
          <Typography
            component="p"
            sx={{
              mt: '12px',
              fontSize: {xs: '22px', lg: '26px'},
              lineHeight: 1.15,
              fontWeight: 850,
              fontVariantNumeric: 'tabular-nums',
              overflowWrap: 'anywhere',
            }}>
            {value}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{mt: '6px'}}>
          {helper}
        </Typography>
      </Box>
    </Card>
  );
}

export default function SalesHistory() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<SalesHistoryPeriod>('daily');
  const [soldByUserId, setSoldByUserId] = useState('');
  const [page, setPage] = useState(1);

  const sellers = useListSalesUsersQuery();
  const history = useGetSalesHistoryQuery({
    Period: period,
    SoldByUserId: soldByUserId || undefined,
    Page: page,
    Size: PAGE_SIZE,
  });

  const reportData = history.currentData;
  const reportLoading = history.isFetching && !reportData;
  const reportUnavailable = history.isError && !reportData;
  const summary = reportData?.Summary;
  const rows = useMemo<SalesTableRow[]>(
    () =>
      (reportData?.Data ?? []).map(row => ({
        ...row,
        CustomerName: row.WholeSalerName || 'Walk-in customer',
        TotalDisplay: money(row.TotalAmount),
        ReceivedDisplay: money(row.PaymentAmount),
        DueDisplay: money(row.DueAmount),
      })),
    [reportData?.Data],
  );
  const trend = summary?.DailyTrend ?? [];
  const selectedPeriod =
    SALES_PERIODS.find(option => option.value === period)?.label ?? 'Today';

  const changePeriod = (_event: React.MouseEvent<HTMLElement>, value: SalesHistoryPeriod | null) => {
    if (!value) return;
    setPeriod(value);
    setPage(1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        animation: 'sales-page-enter 320ms ease-out both',
        '@keyframes sales-page-enter': {
          from: {opacity: 0, transform: 'translateY(6px)'},
          to: {opacity: 1, transform: 'translateY(0)'},
        },
        '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
      }}>
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: {xs: 'flex-start', md: 'flex-end'},
          justifyContent: 'space-between',
          flexDirection: {xs: 'column', md: 'row'},
          gap: '16px',
          mb: '20px',
        }}>
        <Box>
          <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <Box
              sx={{
                width: '38px',
                height: '38px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '11px',
                color: 'primary.main',
                bgcolor: theme =>
                  varAlpha(theme.vars.palette.primary.mainChannel, 0.12),
              }}>
              <IconCalendarStats size={22} />
            </Box>
            <Typography component="h1" variant="h4" fontWeight={900}>
              Sales history
            </Typography>
          </Box>
          <Typography color="text.secondary" sx={{mt: '8px', maxWidth: '680px'}}>
            Server-validated product sales and seller performance in one ledger.
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{fontVariantNumeric: 'tabular-nums'}}>
          {reportLoading
            ? 'Updating report...'
            : reportUnavailable
              ? 'Report unavailable'
              : summary
            ? `${dateLabel(summary.StartDate)} - ${inclusiveDateLabel(summary.EndDateExclusive)}`
                : selectedPeriod}
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          p: {xs: '12px', sm: '16px'},
          mb: '16px',
          borderRadius: '14px',
          boxShadow: 'none',
        }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 280px'},
            gap: '14px',
            alignItems: 'center',
          }}>
          <Box sx={{minWidth: 0, pb: '2px'}}>
            <ToggleButtonGroup
              exclusive
              value={period}
              onChange={changePeriod}
              aria-label="Sales period"
              sx={{
                width: '100%',
                p: '4px',
                gap: '4px',
                borderRadius: '12px',
                bgcolor: 'background.neutral',
                '& .MuiToggleButtonGroup-grouped': {
                  flex: 1,
                  minHeight: '42px',
                  border: 0,
                  borderRadius: '9px !important',
                  color: 'text.secondary',
                  fontWeight: 750,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    boxShadow: theme.shadows[2],
                  },
                },
              }}>
              {SALES_PERIODS.map(option => (
                <ToggleButton key={option.value} value={option.value}>
                  <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}>
                    {option.label}
                  </Box>
                  <Box component="span" sx={{display: {xs: 'inline', sm: 'none'}}}>
                    {option.shortLabel}
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel id="sales-history-seller-label" shrink>Sold by</InputLabel>
            <Select
              id="sales-history-seller"
              labelId="sales-history-seller-label"
              value={soldByUserId}
              label="Sold by"
              displayEmpty
              renderValue={value =>
                value
                  ? sellers.data?.Data.find(seller => seller.ItemId === value)
                      ?.DisplayName ?? 'Selected seller'
                  : 'All sellers'
              }
              onChange={event => {
                setSoldByUserId(event.target.value);
                setPage(1);
              }}>
              <MenuItem value="">All sellers</MenuItem>
              {(sellers.data?.Data ?? []).map(seller => (
                <MenuItem key={seller.ItemId} value={seller.ItemId}>
                  {seller.DisplayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {history.isError && (
        <Alert
          severity="error"
          sx={{mb: '16px'}}
          action={<Button onClick={() => {history.refetch(); sellers.refetch();}}>Retry</Button>}>
          {reportData
            ? 'The latest refresh failed. Showing the last validated totals for this selected scope.'
            : 'Sales records are unavailable. No totals are shown until the report can be loaded.'}
        </Alert>
      )}

      {sellers.isError && !history.isError && (
        <Alert
          severity="warning"
          sx={{mb: '16px'}}
          action={<Button onClick={() => sellers.refetch()}>Retry</Button>}>
          The seller list could not be loaded. The current report is still available.
        </Alert>
      )}

      {!reportUnavailable && <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))'},
          gap: {xs: '10px', sm: '14px'},
          mb: '16px',
        }}>
        <MetricCard loading={reportLoading} label="Sales" value={money(summary?.TotalSales)} helper={selectedPeriod} tone="primary" icon={<IconTrendingUp size={19} />} />
        <MetricCard loading={reportLoading} label="Received" value={money(summary?.TotalReceived)} helper="Payments on these invoices" tone="success" icon={<IconCash size={19} />} />
        <MetricCard loading={reportLoading} label="Outstanding" value={money(summary?.OutstandingDue)} helper="Still receivable" tone="warning" icon={<IconWallet size={19} />} />
        <MetricCard loading={reportLoading} label="Invoices" value={String(summary?.InvoiceCount ?? 0)} helper="Product invoices" tone="neutral" icon={<IconFileInvoice size={19} />} />
      </Box>

      <Card
        variant="outlined"
        sx={{mb: '12px', borderRadius: '14px', boxShadow: 'none'}}>
        <Box
          sx={{
            p: {xs: '10px 14px', sm: '12px 16px'},
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
          <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <IconReceipt2 size={20} color={theme.vars.palette.success.main} />
            <Box>
              <Typography variant="overline" color="text.secondary" fontWeight={800}>
                Gross profit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sales minus product cost
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h6"
            fontWeight={850}
            color="success.main"
            sx={{fontVariantNumeric: 'tabular-nums'}}>
            {reportLoading ? <Skeleton width={110} /> : money(summary?.GrossProfit)}
          </Typography>
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            trend.length > 1
              ? {xs: 'minmax(0, 1fr)', lg: 'minmax(300px, 0.72fr) minmax(0, 1.7fr)'}
              : 'minmax(0, 1fr)',
          gap: '16px',
          alignItems: 'start',
        }}>
        {trend.length > 1 && <Card
          component="section"
          variant="outlined"
          sx={{p: {xs: '16px', sm: '18px'}, borderRadius: '14px', boxShadow: 'none', order: {xs: 2, lg: 1}}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap="12px">
            <Box>
              <Typography variant="h6" fontWeight={850}>Daily sales pulse</Typography>
              <Typography variant="body2" color="text.secondary">Sales movement inside this period</Typography>
            </Box>
            <IconTrendingUp size={22} color={theme.vars.palette.primary.main} />
          </Stack>
            <Box sx={{height: '200px', mt: '14px'}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{top: 8, right: 4, left: -18, bottom: 0}}>
                  <CartesianGrid stroke={theme.vars.palette.divider} strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="Date" tickFormatter={dateLabel} tick={{fill: theme.vars.palette.text.secondary, fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={compactMoney} tick={{fill: theme.vars.palette.text.secondary, fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [money(value), 'Sales']} labelFormatter={dateLabel} contentStyle={{color: theme.vars.palette.text.primary, background: theme.vars.palette.background.paper, border: `1px solid ${theme.vars.palette.divider}`, borderRadius: '10px'}} />
                  <Area type="monotone" dataKey="TotalSales" stroke={theme.vars.palette.primary.main} fill={varAlpha(theme.vars.palette.primary.mainChannel, 0.16)} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
        </Card>}

        <Box component="section" sx={{minWidth: 0, order: {xs: 1, lg: 2}}}>
          <Box sx={{mb: '10px'}}>
            <Typography variant="h6" fontWeight={850}>Sales ledger</Typography>
            <Typography variant="body2" color="text.secondary">Select any row to open the full invoice record.</Typography>
          </Box>
          <CustomTable
            columns={salesColumns}
            data={rows}
            totalCount={reportData?.TotalCount ?? 0}
            rowsPerPage={PAGE_SIZE}
            currentPage={page}
            isServerPaginated
            isRowClickable
            isLoading={reportLoading || history.isFetching}
            handlePageSelection={setPage}
            handleRowClick={row => navigate(`/invoice/details/${row.ItemId}`)}
            emptyState={{
              title: 'No product sales in this period',
              description: 'Try another seller or time window. Due-payment entries are intentionally excluded because they are collections, not new sales.',
            }}
          />
        </Box>
      </Box>
      </>}
    </Box>
  );
}
