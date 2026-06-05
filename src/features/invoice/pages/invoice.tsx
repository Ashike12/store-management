import CustomTable from '@components/table/CustomTable';
import { useGetInvoiceQuery } from '@core/store/api/invoiceApi';
import { IInvoice } from '@core/interfaces/api/IInvoice';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '@components/button/CustomButton';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAppSelector } from '@core/store/hooks';
import { selectIsWholeSaler } from '@core/store/slices/auth.slice';
import { useGetDashboardDataQuery } from '@core/store/api/invoiceApi';

// Define table columns
export const InvoiceColumns = [
  { altKey: "", key: "InvoiceNumber", label: "INVOICE_NUMBER" },
  { altKey: "", key: "InvoiceType", label: "INVOICE_TYPE" },
  { altKey: "InvoiceType", key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
  { altKey: "", key: "TotalAmount", label: "TOTAL_BILL" },
  { altKey: "", key: "PaymentAmount", label: "PAID_AMOUNT" },
  { altKey: "", key: "ProfitMargin", label: "YOUR_PROFIT" },
];

export const getInvoiceColumns = (isWholeSaler: boolean) =>
  isWholeSaler
    ? InvoiceColumns.filter(column => column.key !== 'ProfitMargin')
    : InvoiceColumns;

export default function Invoice() {
  const [payload, setPayload] = useState({ pageNumber: 1, pageSize: 10000, itemId: '' });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, refetch } = useGetInvoiceQuery(payload);
  const { data: dashboardData } = useGetDashboardDataQuery({});
  const isWholeSaler = useAppSelector(selectIsWholeSaler);
  const navigate = useNavigate();
  const invoiceList = (data?.Data as IInvoice[]) || [];

  const handleRowClick = async (row: IInvoice) => {
    navigate(`/invoice/details/${row.ItemId}`);
  }
  const addInvoice = () => {
    navigate(`/invoice/add/new?isUpdate=false`);
  }
  useEffect(() => {
    // Refetch when component mounts
    refetch();
  }, [refetch]);
  const handlePageSelection = (page: number) => {
    // setPayload((prev) => ({ ...prev, pageNumber: page }));
    // refetch();
  }
  const filteredData = useMemo(() => {
    if (!data?.Data) return [];
    const dataList = data.Data as IInvoice[];
    const getInvoiceTypeLabel = (invoiceType: string) => {
      if (invoiceType === 'DUE_PAYMENT') return 'Due Payment';
      if (invoiceType === 'WHOLESALE') return 'Product (Wholesaler)';
      if (invoiceType === 'CONSUMER') return 'Product (Consumer)';
      return invoiceType || 'N/A';
    };

    return dataList.filter((item) => {
      const created = dayjs(item.CreatedDate);
      const matchesDate =
        (!fromDate || created.isAfter(dayjs(fromDate).subtract(1, 'day'))) &&
        (!toDate || created.isBefore(dayjs(toDate).add(1, 'day')));

      const matchesSearch = item.WholeSalerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.InvoiceNumber && item.InvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesDate && matchesSearch;
    }).map(item => ({
      ...item,
      InvoiceType: getInvoiceTypeLabel(item.InvoiceType),
    }));
  }, [data, fromDate, toDate, searchTerm]);
  return (
    <>
      <div className='w-full'>
        <div className="p-10 w-full">
          {isWholeSaler && (
            <div className="mb-4 rounded-md border p-4">
              <div className="text-sm">Total Due Amount</div>
              <div className="text-2xl font-bold text-[var(--palette-warning-main)]">
                {dashboardData?.Data?.TotalDueAmount ?? 0}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col cursor-pointer">
              <label className="text-sm mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col cursor-pointer">
              <label className="text-sm mb-1">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isWholeSaler ? "Search by invoice no." : "Search by wholesaler or invoice no."}
                className="border p-2 rounded w-full"
              />
            </div>
            {!isWholeSaler && (
              <div className="flex flex-col mt-6">
                <CustomButton
                  onClick={() => addInvoice()}
                  className='cursor-pointer'
                  text={'ADD_INVOICE'}
                  variant={'primary'}
                />
              </div>
            )}
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : filteredData.length > 0 ? (
            <CustomTable
              isRowClickable={true}
              handleRowClick={handleRowClick}
              columns={getInvoiceColumns(isWholeSaler)}
              data={filteredData}
              totalCount={data?.TotalCount}
              handlePageSelection={handlePageSelection}
              rowsPerPage={10} />
          ) : (
            <div>No data found</div>
          )}
        </div>
      </div>
    </>
  );
}
