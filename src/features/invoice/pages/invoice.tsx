import CustomTable from '@components/table/CustomTable';
import { useGetInvoiceQuery } from '@core/store/api/invoiceApi';
import { IInvoice } from '@core/interfaces/api/IInvoice';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '@components/button/CustomButton';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

// Define table columns
export const InvoiceColumns = [
  { altKey: "", key: "InvoiceNumber", label: "INVOICE_NUMBER" },
  { altKey: "InvoiceType", key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
  { altKey: "", key: "TotalAmount", label: "TOTAL_BILL" },
  { altKey: "", key: "PaymentAmount", label: "PAID_AMOUNT" },
  { altKey: "", key: "ProfitMargin", label: "YOUR_PROFIT" },
];

export default function Invoice() {
  const [payload, setPayload] = useState({ pageNumber: 1, pageSize: 10000, itemId: '' });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, refetch } = useGetInvoiceQuery(payload);
  const navigate = useNavigate();
  let invoiceList = (data?.Data as IInvoice[]) || [];

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
    console.log('page', page);
  }
  const filteredData = useMemo(() => {
    if (!data?.Data) return [];
    const dataList = data.Data as IInvoice[];
    return dataList.filter((item) => {
      const created = dayjs(item.CreatedDate);
      const matchesDate =
        (!fromDate || created.isAfter(dayjs(fromDate).subtract(1, 'day'))) &&
        (!toDate || created.isBefore(dayjs(toDate).add(1, 'day')));

      const matchesSearch = item.WholeSalerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.InvoiceNumber && item.InvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesDate && matchesSearch;
    });
  }, [data, fromDate, toDate, searchTerm]);
  return (
    <>
      <div className='w-full'>
        <CustomButton onClick={() => addInvoice()} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_INVOICE'} variant={'primary'}></CustomButton>
        {data && data && invoiceList.length > 0 && (<div className="p-10 w-full">
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
                placeholder="Search by wholesaler or invoice no."
                className="border p-2 rounded w-full"
              />
            </div>
          </div>
          <CustomTable
            isRowClickable={true}
            handleRowClick={handleRowClick}
            columns={InvoiceColumns}
            data={filteredData}
            totalCount={data?.TotalCount}
            handlePageSelection={handlePageSelection}
            rowsPerPage={10} />
        </div>)}
        {!isLoading && invoiceList && invoiceList.length == 0 && (<div className="p-10 w-full">
          No data found
        </div>)}
        {(isLoading) && (<div className="p-10 w-full">
          Loading...
        </div>)}
      </div>
    </>
  );
}
