import CustomTable from '@components/table/CustomTable';
import TextWrapper from '@components/text/TextWrapper';
import {IInvoice} from '@core/interfaces/api/IInvoice';
import {useGetInvoiceQuery} from '@core/store/api/invoiceApi';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {IconArrowNarrowRight} from '@tabler/icons-react';
import {CustomButton} from '@components/button/CustomButton';
import {useTheme} from '@mui/material/styles';

const columns = [
  {key: 'InvoiceNumber', label: 'INVOICE_NUMBER'},
  {key: 'CreatedDate', label: 'CREATED_DATE'},
  {key: 'WholeSalerName', label: 'WHOLE_SLAER_NAME'},
  {key: 'TotalAmount', label: 'TOTAL_BILL'},
  {key: 'PaymentAmount', label: 'PAID_AMOUNT'},
  {key: 'GrossProfit', label: 'GROSS_PROFIT'},
  {key: 'RealizedCashMargin', label: 'REALIZED_CASH_MARGIN'},
];

export default function WholesalerDetails() {
  const theme = useTheme();
  const {id} = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber')?.trim();
  const wholesalerName = searchParams.get('wholesalerName') ?? 'N/A';
  const {data, isLoading} = useGetInvoiceQuery({
    pageNumber: 1,
    pageSize: 10,
    itemId: '',
    wholesalerId: id ?? '',
  });
  const invoiceData = (data?.Data as IInvoice[]) || [];
  const handleRowClick = async (row: IInvoice) => {
    navigate(`/invoice/details/${row.ItemId}`);
  };
  const summary = data?.Summary;
  const totalAmount = summary?.TotalBilled ?? 0;
  const totalPaidAmount = summary?.CashCollected ?? 0;
  const totalGrossProfit = summary?.GrossProfit ?? 0;
  const realizedCashMargin = summary?.RealizedCashMargin ?? 0;
  const dueAmount = summary?.OutstandingDue ?? 0;
  const openSMS = () => {
    const smsUrl = `sms:+${phoneNumber}?body=${encodeURIComponent('You have due amount of: ' + dueAmount + ' tk, please pay it as soon as possible.')}`;
    window.location.href = smsUrl;
  };
  const addInvoice = () => {
    navigate(`/invoice/add/new?isUpdate=false&wholesalerId=${id ?? ''}`);
  };
  return (
    <>
      <div className="w-full">
        <div
          className="mx-auto mt-10 rounded-xl p-6 shadow-lg"
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
              Wholesaler Details
            </h2>
            <CustomButton
              onClick={() => addInvoice()}
              className="cursor-pointer"
              text={'ADD_INVOICE'}
              variant={'primary'}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div>
              <TextWrapper
                variant={'H6'}
                content={'WHOLESALER_NAME'}></TextWrapper>
              <TextWrapper
                className="text-bold !text-green"
                variant={'Body1'}
                content={': ' + wholesalerName}></TextWrapper>
            </div>
            <div>
              <TextWrapper variant={'H6'} content={'TOTAL_BILL'}></TextWrapper>
              <TextWrapper
                className="text-bold text-green"
                variant={'Body1'}
                content={': ' + totalAmount + ' tk'}></TextWrapper>
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'TOTAL_PAID_AMOUNT'}></TextWrapper>
              <TextWrapper
                className="text-bold text-green"
                variant={'Body1'}
                content={': ' + totalPaidAmount + ' tk'}></TextWrapper>
            </div>
            <div className="flex flex-row">
              <TextWrapper
                variant={'H6'}
                content={'TOTAL_DUE_AMOUNT'}></TextWrapper>
              :
              <TextWrapper
                className={
                  dueAmount > 0
                    ? 'font-semibold text-[var(--palette-error-main)]'
                    : 'font-semibold text-[var(--palette-success-main)]'
                }
                variant={'Body1'}
                content={' ' + dueAmount + ' tk'}
              />
            </div>
            {dueAmount > 0 && (
              <div
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
                style={{
                  backgroundColor: theme.vars.palette.background.neutral,
                  borderColor: theme.vars.palette.divider,
                }}>
                <div className="flex items-center gap-2">
                  <TextWrapper
                    variant={'Body2Medium'}
                    content={'Due message for'}
                  />
                  <TextWrapper
                    variant={'Body2Medium'}
                    className="font-semibold"
                    content={`${dueAmount} tk`}
                  />
                </div>
                <CustomButton
                  onClick={openSMS}
                  className="cursor-pointer"
                  text={'SEND_A_MESSAGE'}
                  variant={'outline'}
                  size={'sm'}
                  Icon={IconArrowNarrowRight}
                  iconAlign="right"
                />
              </div>
            )}
            <div>
              <TextWrapper
                variant={'H6'}
                content={'GROSS_PROFIT'}></TextWrapper>
              :
              {totalGrossProfit >= 0 ? (
                <TextWrapper
                  className="!text-green text-bold"
                  variant={'Body1'}
                  content={totalGrossProfit + ' tk'}></TextWrapper>
              ) : (
                <TextWrapper
                  className="!text-red text-bold"
                  variant={'Body1'}
                  content={' ' + totalGrossProfit + ' tk'}></TextWrapper>
              )}
            </div>
            <div>
              <TextWrapper
                variant={'H6'}
                content={'REALIZED_CASH_MARGIN'}></TextWrapper>
              :
              <TextWrapper
                className={
                  realizedCashMargin >= 0
                    ? '!text-green text-bold'
                    : '!text-red text-bold'
                }
                variant={'Body1'}
                content={' ' + realizedCashMargin + ' tk'}
              />
            </div>
              <div className="w-full py-8">
                <CustomTable
                  isRowClickable={true}
                  handleRowClick={handleRowClick}
                  columns={columns}
                  data={invoiceData || []}
                  rowsPerPage={10}
                  isLoading={isLoading}
                  emptyState={{
                    title: 'No invoices for this wholesaler',
                    description: 'Create an invoice to begin tracking purchases, payments and due amounts.',
                    actionLabel: 'Add invoice',
                    onAction: addInvoice,
                  }}
                />
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
