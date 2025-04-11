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

export default function invoiceDetails() {
    const { id } = useParams();
    const { data, isLoading } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: id ?? '' });
    const invoiceData = (data?.Data as InvoiceDetailsResponse) || {};
    const navigate = useNavigate();
    const handleButtonAction = (action: string) => {
        navigate(`/invoice/${action}/${id}?isUpdate=${action === 'update'}`);
    }
    return (
        <>
            <div className='w-full'>
                {/* <div className="fixed top-16 w-full h-64 bg-cover bg-center z-0">
                    <img className="w-full h-[200px] object-cover"  src={InvoiceBg} alt="Invocie bg" />
                </div> */}
                <CustomButton onClick={() => handleButtonAction('add')} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_INVOICE'} variant={'primary'}></CustomButton>
                <CustomButton onClick={() => handleButtonAction('update')} className='fixed bottom-4 right-30 ml-4 my-3 cursor-pointer' text={'UPDATE_INVOICE'} variant={'primary'}></CustomButton>

                <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                    {/* Invoice Header */}
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                        Invoice Details
                    </h2>

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
