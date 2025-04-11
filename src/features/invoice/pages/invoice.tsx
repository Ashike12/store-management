import CustomTable from '@components/table/CustomTable';
import { useGetInvoiceQuery } from '@core/store/api/invoiceApi';
import { IInvoice } from '@core/interfaces/api/IInvoice';
import { useNavigate } from 'react-router-dom';

// Define table columns
const columns = [
  { altKey: "", key: "InvoiceNumber", label: "INVOICE_NUMBER" },
  { altKey: "InvoiceType", key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
  { altKey: "", key: "TotalAmount", label: "TOTAL_BILL" },
  { altKey: "", key: "PaymentAmount", label: "PAID_AMOUNT" },
  { altKey: "", key: "ProfitMargin", label: "YOUR_PROFIT" },
];

export default function Invoice() {
  const { data, isLoading } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
  const navigate = useNavigate();
  let invoiceList = (data?.Data as IInvoice[]) || [];

  const handleRowClick = async (row: IInvoice) => {
    navigate(`/invoice/details/${row.ItemId}`);
  }
  return (
    <>
      <div className='w-full'>
        {data && data && invoiceList.length > 0 && (<div className="p-10 w-full">
          <CustomTable
            isRowClickable={true}
            handleRowClick={handleRowClick}
            columns={columns}
            data={invoiceList || []}
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
