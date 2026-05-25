import CustomTable from "@components/table/CustomTable";
import TextWrapper from "@components/text/TextWrapper";
import { IInvoice } from "@core/interfaces/api/IInvoice";
import { useGetInvoiceQuery } from "@core/store/api/invoiceApi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { CustomButton } from "@components/button/CustomButton";

const columns = [
    { key: "InvoiceNumber", label: "INVOICE_NUMBER" },
    { key: "CreatedDate", label: "CREATED_DATE" },
    { key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
    { key: "TotalAmount", label: "TOTAL_BILL" },
    { key: "PaymentAmount", label: "PAID_AMOUNT" },
    { key: "ProfitMargin", label: "YOUR_PROFIT" },
];


export default function WholesalerDetails() {
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
    const openSMS = () => {
        const smsUrl = `sms:+${phoneNumber}?body=${encodeURIComponent('You have due amount of: ' + (totalAmount - totalPaidAmount) + ' tk, please pay it as soon as possible.')}`;
        window.location.href = smsUrl;
    };
    const addInvoice = () => {
        navigate(`/invoice/add/new?isUpdate=false`);
    }
    return (
        <>
            <div className='w-full'>
                <div className=" mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                    {/* Invoice Header */}
                    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                        <h2 className="text-2xl flex-1 font-bold text-gray-800 border-b pb-3">
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
                            {totalAmount <= totalPaidAmount ? (<TextWrapper className="!text-green text-bold" variant={'Body1'} content={((totalAmount - totalPaidAmount)) + ' tk'}>
                            </TextWrapper>) : (<TextWrapper className="!text-red text-bold" variant={'Body1'} content={' ' + ((totalAmount - totalPaidAmount)) + ' tk'}>
                            </TextWrapper>)}
                            {totalAmount > totalPaidAmount && (<div className="pl-3 cursor-pointer flex flex-row" onClick={openSMS}>
                                <TextWrapper content={'SEND_A_MESSAGE'}></TextWrapper>
                                <div className="pl-2 pt-[3px]">
                                    <IconArrowNarrowRight size={20} />
                                </div>
                            </div>)}
                        </div>
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
