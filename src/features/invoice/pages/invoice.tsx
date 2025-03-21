import CustomTable from '@components/table/CustomTable';
import { useGetInvoiceQuery } from '@core/store/api/invoiceApi';
import { IInvoice } from '@core/interfaces/api/IInvoice';

// Define table columns
const columns = [
  { key: "InvoiceNumber", label: "INVOICE_NUMBER" },
  { key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
  { key: "TotalAmount", label: "TOTAL_BILL" },
  { key: "PaymentAmount", label: "PAID_AMOUNT" },
  { key: "ProfitMargin", label: "YOUR_PROFIT" },
];

export default function StoreManagement() {
  const { data, isLoading } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: '' });

  const handleRowClick = async (row: IInvoice) => {
    console.log(row);
  }
  return (
    <>
      <div className='w-full'>
        {data && data && data?.Data?.length > 0 && (<div className="p-10 w-full">
          <CustomTable
            isRowClickable={true}
            handleRowClick={handleRowClick}
            columns={columns}
            data={data?.Data || []}
            rowsPerPage={10} />
        </div>)}
        {!isLoading && data && data && data?.Data?.length == 0 && (<div className="p-10 w-full">
          No data found
        </div>)}
        {(isLoading) && (<div className="p-10 w-full">
          Loading...
        </div>)}
      </div>
    </>
  );
}
