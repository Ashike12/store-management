import {SalesHistoryPeriod} from '@core/interfaces/api/IInvoice';

export const SALES_PERIODS: {
  value: SalesHistoryPeriod;
  label: string;
  shortLabel: string;
}[] = [
  {value: 'daily', label: 'Today', shortLabel: 'Today'},
  {value: 'last7Days', label: 'Last 7 days', shortLabel: '7 days'},
  {value: 'last30Days', label: 'Last 30 days', shortLabel: '30 days'},
  {value: 'currentMonth', label: 'Current month', shortLabel: 'Month'},
];
