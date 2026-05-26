import CustomTable from "@components/table/CustomTable";
import TextWrapper from "@components/text/TextWrapper";
import { IInvoice } from "@core/interfaces/api/IInvoice";
import { useGetInvoiceQuery } from "@core/store/api/invoiceApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { CustomButton } from "@components/button/CustomButton";
import { useTheme } from "@mui/material/styles";

const columns = [
    { key: "InvoiceNumber", label: "INVOICE_NUMBER" },
    { key: "CreatedDate", label: "CREATED_DATE" },
    { key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
    { key: "TotalAmount", label: "TOTAL_BILL" },
    { key: "PaymentAmount", label: "PAID_AMOUNT" },
    { key: "ProfitMargin", label: "YOUR_PROFIT" },
];


export default function WholesalerDetails() {
    const theme = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const phoneNumber = searchParams.get("phoneNumber")?.trim();
    const wholesalerName = searchParams.get("wholesalerName") ?? 'N/A';
    const { data } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: '', wholesalerId: id ?? '' });
    const invoiceData = (data?.Data as IInvoice[]) || [];
    const handleRowClick = async (row: IInvoice) => {
        navigate(`/invoice/details/${row.ItemId}`);
    }
    const totalAmount = invoiceData.reduce((acc, item) => acc + (item.TotalAmount || 0), 0);
    const totalPaidAmount = invoiceData.reduce((acc, item) => acc + (item.PaymentAmount || 0), 0);
    const totalProfit = invoiceData.reduce((acc, item) => acc + (item.ProfitMargin || 0), 0);
    const dueAmount = totalAmount - totalPaidAmount;
    const openSMS = () => {
        const smsUrl = `sms:+${phoneNumber}?body=${encodeURIComponent('You have due amount of: ' + (totalAmount - totalPaidAmount) + ' tk, please pay it as soon as possible.')}`;
        window.location.href = smsUrl;
    };
    const addInvoice = () => {
        navigate(`/invoice/add/new?isUpdate=false&wholesalerId=${id ?? ''}`);
    }
    return (
        <>
            <div className='w-full'>
                <div
                  className=" mx-auto p-6 shadow-lg rounded-xl mt-10"
                  style={{
                    backgroundColor: theme.vars.palette.background.paper,
                    color: theme.vars.palette.text.primary,
                  }}>
                    {/* Invoice Header */}
                    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                        <h2
                          className="text-2xl flex-1 font-bold border-b pb-3"
                          style={{
                            color: theme.vars.palette.text.primary,
                            borderColor: theme.vars.palette.divider,
                          }}>
                            Wholesaler Details
                        </h2>
                        <CustomButton
                            onClick={() => addInvoice()}
                            className='cursor-pointer'
                            text={'ADD_INVOICE'}
                            variant={'primary'}
                        />
                    </div>

                    <div className="mt-4 space-y-2">
                        <div>
                            <TextWrapper variant={'H6'} content={'WHOLESALER_NAME'}>
                            </TextWrapper>
                            <TextWrapper className="text-bold !text-green " variant={'Body1'} content={': ' + (wholesalerName)}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'TOTAL_BILL'}>
                            </TextWrapper>
                            <TextWrapper className="text-bold text-green" variant={'Body1'} content={': ' + (totalAmount) + ' tk'}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'TOTAL_PAID_AMOUNT'}>
                            </TextWrapper>
                            <TextWrapper className="text-bold text-green" variant={'Body1'} content={': ' + (totalPaidAmount) + ' tk'}>
                            </TextWrapper>
                        </div>
                        <div className="flex flex-row">
                            <TextWrapper variant={'H6'} content={'TOTAL_DUE_AMOUNT'}>
                            </TextWrapper>
                            :
                            <TextWrapper
                              className={dueAmount > 0 ? 'font-semibold text-[var(--palette-error-main)]' : 'font-semibold text-[var(--palette-success-main)]'}
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
                              <TextWrapper variant={'Body2Medium'} content={'Due message for'} />
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
                            <TextWrapper variant={'H6'} content={'YOUR_PROFIT'}>
                            </TextWrapper>
                            :
                            {totalProfit >= 0 ? (<TextWrapper className="!text-green text-bold" variant={'Body1'} content={(totalProfit) + ' tk'}>
                            </TextWrapper>) : (<TextWrapper className="!text-red text-bold" variant={'Body1'} content={' ' + (totalProfit) + ' tk'}>
                            </TextWrapper>)}
                        </div>
                        {invoiceData && invoiceData?.length > 0 && (<div className="p-10 w-full">
                            <CustomTable
                                isRowClickable={true}
                                handleRowClick={handleRowClick}
                                columns={columns}
                                data={invoiceData || []}
                                rowsPerPage={10} />
                        </div>)}

                    </div>
                </div>
            </div>
        </>
    )
}
