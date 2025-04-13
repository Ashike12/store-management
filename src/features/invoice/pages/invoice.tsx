import CustomTable from '@components/table/CustomTable';
import { useGetInvoiceQuery } from '@core/store/api/invoiceApi';
import { IInvoice } from '@core/interfaces/api/IInvoice';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '@components/button/CustomButton';
import { useEffect } from 'react';

// Define table columns
export const InvoiceColumns = [
  { altKey: "", key: "InvoiceNumber", label: "INVOICE_NUMBER" },
  { altKey: "InvoiceType", key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
  { altKey: "", key: "TotalAmount", label: "TOTAL_BILL" },
  { altKey: "", key: "PaymentAmount", label: "PAID_AMOUNT" },
  { altKey: "", key: "ProfitMargin", label: "YOUR_PROFIT" },
];

export default function Invoice() {
  const { data, isLoading, refetch } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
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
  return (
    <>
      <div className='w-full'>
        <CustomButton onClick={() => addInvoice()} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_INVOICE'} variant={'primary'}></CustomButton>
        {data && data && invoiceList.length > 0 && (<div className="p-10 w-full">
          <CustomTable
            isRowClickable={true}
            handleRowClick={handleRowClick}
            columns={InvoiceColumns}
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
