import { CustomButton } from "@components/button/CustomButton";
import CustomTable from "@components/table/CustomTable";
import TextWrapper from "@components/text/TextWrapper";
import { InvoiceDetailsResponse } from "@core/interfaces/api/IInvoice";
import { useGetInvoiceQuery } from "@core/store/api/invoiceApi";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
    { key: "ProductName", label: "PRODUCT_NAME" },
    { key: "SellingPrice", label: "SELLING_COST" },
    { key: "Quantity", label: "QUANTITY" }
];

export default function InvoiceDetails() {
    const { id } = useParams();
    const { data } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: id ?? '' });
    const invoiceData = (data?.Data as InvoiceDetailsResponse) || {};
    const navigate = useNavigate();
    const handleButtonAction = (action: string) => {
        navigate(`/invoice/${action}/${id}?isUpdate=${action === 'update'}`);
    }
    return (
        <>
            <div className='w-full'>

                <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                    {/* Invoice Header */}
                    <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                        <h2 className="text-2xl flex-1 font-bold text-gray-800 border-b pb-3">
                            Invoice Details
                        </h2>
                        <div className="flex gap-4">
                            <CustomButton
                                onClick={() => handleButtonAction('add')}
                                className='cursor-pointer'
                                text={'ADD_INVOICE'}
                                variant={'primary'}
                            />
                            <CustomButton
                                onClick={() => handleButtonAction('update')}
                                className='cursor-pointer'
                                text={'UPDATE_INVOICE'}
                                variant={'primary'}
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div>
                            <TextWrapper variant={'H6'} content={'INVOICE_NUMBER'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.InvoiceNumber ?? 'N/A')}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'WHOLESALER_NAME'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.WholeSalerName ?? 'N/A')}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'PAYMENT_AMOUNT'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.PaymentAmount ?? 'N/A')}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'PROFIT_MARGIN'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.ProfitMargin ?? 'N/A')}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'TOTAL_AMOUNT'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.TotalAmount ?? 'N/A')}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'CREATED_DATE'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (invoiceData.CreatedDate ? new Date(invoiceData.CreatedDate).toLocaleDateString() ?? 'N/A' : 'N/A')}>
                            </TextWrapper>
                        </div>

                        {invoiceData?.ProductSellInfo && invoiceData?.ProductSellInfo.length > 0 && (<div className="p-10 w-full">
                            <CustomTable
                                isRowClickable={false}
                                columns={columns}
                                data={invoiceData?.ProductSellInfo || []}
                                rowsPerPage={10} />
                        </div>)}

                    </div>
                </div>
            </div>
        </>
    )
}
