import {CustomButton} from '@components/button/CustomButton';
import CustomTable from '@components/table/CustomTable';
import TextWrapper from '@components/text/TextWrapper';
import {InvoiceDetailsResponse} from '@core/interfaces/api/IInvoice';
import {useGetInvoiceQuery} from '@core/store/api/invoiceApi';
import {useAppSelector} from '@core/store/hooks';
import {selectIsWholeSaler} from '@core/store/slices/auth.slice';
import {useNavigate, useParams} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import {DetailSkeleton} from '@components/loaders/AdminSkeleton';

const columns = [
  {key: 'ProductName', label: 'PRODUCT_NAME'},
  {key: 'SellingPrice', label: 'SELLING_COST'},
  {key: 'Quantity', label: 'QUANTITY'},
];

export default function InvoiceDetails() {
  const {id} = useParams();
  const theme = useTheme();
  const isWholeSaler = useAppSelector(selectIsWholeSaler);
  const {data, isLoading} = useGetInvoiceQuery({
    pageNumber: 1,
    pageSize: 10,
    itemId: id ?? '',
  });
  const invoiceData = (data?.Data as InvoiceDetailsResponse) || {};
  const getInvoiceTypeLabel = (invoiceType?: string) => {
    if (invoiceType === 'DUE_PAYMENT') return 'Due Payment';
    if (invoiceType === 'WHOLESALE') return 'Product (Wholesaler)';
    if (invoiceType === 'CONSUMER') return 'Product (Consumer)';
    return invoiceType ?? 'N/A';
  };
  const navigate = useNavigate();
  const handleButtonAction = (action: string) => {
    if (action === 'add') {
      navigate(
        `/invoice/add/new?isUpdate=false&wholesalerId=${invoiceData.WholeSalerId ?? ''}`,
      );
      return;
    }
    navigate(`/invoice/${action}/${id}?isUpdate=${action === 'update'}`);
  };
  if (isLoading) {
    return <div className="w-full p-8"><DetailSkeleton rows={7} /></div>;
  }
  return (
    <>
      <div className="w-full">
        <div
          className="mx-auto mt-10 max-w-3xl rounded-xl p-6 shadow-lg"
          style={{
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.text.primary,
          }}>
          {/* Invoice Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2
              className="flex-1 border-b pb-3 text-2xl font-bold"
              style={{
                color: theme.vars.palette.text.primary,
                borderColor: theme.vars.palette.divider,
              }}>
              Invoice Details
            </h2>
            {!isWholeSaler && (
              <div className="flex gap-4">
                <CustomButton
                  onClick={() => handleButtonAction('add')}
                  className="cursor-pointer"
                  text={'ADD_INVOICE'}
                  variant={'primary'}
                />
                <CustomButton
                  onClick={() => handleButtonAction('update')}
                  className="cursor-pointer"
                  text={'UPDATE_INVOICE'}
                  variant={'primary'}
                />
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <div>
              <TextWrapper
                variant={'H6'}
                content={'INVOICE_NUMBER'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' + (invoiceData.InvoiceNumber ?? 'N/A')
                }></TextWrapper>
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'WHOLESALER_NAME'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' + (invoiceData.WholeSalerName ?? 'N/A')
                }></TextWrapper>
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'INVOICE_TYPE'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' + getInvoiceTypeLabel(invoiceData.InvoiceType)
                }></TextWrapper>
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'PAYMENT_AMOUNT'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' + (invoiceData.PaymentAmount ?? 'N/A')
                }></TextWrapper>
            </div>
            {!isWholeSaler && (
              <div>
                <TextWrapper
                  variant={'H6'}
                  content={'GROSS_PROFIT'}></TextWrapper>
                <TextWrapper
                  variant={'Body1'}
                  content={
                    ': ' + (invoiceData.GrossProfit ?? 'N/A')
                  }></TextWrapper>
              </div>
            )}
            {!isWholeSaler && (
              <div>
                <TextWrapper
                  variant={'H6'}
                  content={'REALIZED_CASH_MARGIN'}></TextWrapper>
                <TextWrapper
                  variant={'Body1'}
                  content={
                    ': ' + (invoiceData.RealizedCashMargin ?? 'N/A')
                  }></TextWrapper>
              </div>
            )}
            <div>
              <TextWrapper
                variant={'H6'}
                content={'TOTAL_AMOUNT'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' + (invoiceData.TotalAmount ?? 'N/A')
                }></TextWrapper>
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'CREATED_DATE'}></TextWrapper>
              <TextWrapper
                variant={'Body1'}
                content={
                  ': ' +
                  (invoiceData.CreatedDate
                    ? (new Date(invoiceData.CreatedDate).toLocaleDateString() ??
                      'N/A')
                    : 'N/A')
                }></TextWrapper>
            </div>

            {invoiceData?.ProductSellInfo &&
              invoiceData?.ProductSellInfo.length > 0 && (
                <div className="w-full p-10">
                  <CustomTable
                    isRowClickable={false}
                    columns={columns}
                    data={invoiceData?.ProductSellInfo || []}
                    rowsPerPage={10}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
