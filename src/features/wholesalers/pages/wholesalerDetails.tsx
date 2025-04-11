import CustomTable from "@components/table/CustomTable";
import TextWrapper from "@components/text/TextWrapper";
import { IInvoice } from "@core/interfaces/api/IInvoice";
import { useGetInvoiceQuery } from "@core/store/api/invoiceApi";
import { useNavigate, useParams } from "react-router-dom";

const columns = [
    { key: "InvoiceNumber", label: "INVOICE_NUMBER" },
    { key: "CreatedDate", label: "CREATED_DATE" },
    { key: "WholeSalerName", label: "WHOLE_SLAER_NAME" },
    { key: "TotalAmount", label: "TOTAL_BILL" },
    { key: "PaymentAmount", label: "PAID_AMOUNT" },
    { key: "ProfitMargin", label: "YOUR_PROFIT" },
  ];
  

export default function wholesalerDetails() {
    const { id } = useParams();
    const { data, isLoading } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: '', wholesalerId: id ?? '' });
    const invoiceData = (data?.Data as IInvoice[]) || [];
    const wholesalerName = invoiceData[0]?.WholeSalerName || 'N/A';
    return (
        <>
            <div className='w-full'>
                {/* <div className="fixed top-16 w-full h-64 bg-cover bg-center z-0">
                    <img className="w-full h-[200px] object-cover"  src={InvoiceBg} alt="Invocie bg" />
                </div> */}
                {/* <CustomButton onClick={() => handleButtonAction('add')} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'ADD_INVOICE'} variant={'primary'}></CustomButton>
                <CustomButton onClick={() => handleButtonAction('update')} className='fixed bottom-4 right-30 ml-4 my-3 cursor-pointer' text={'UPDATE_INVOICE'} variant={'primary'}></CustomButton> */}

                <div className=" mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
                    {/* Invoice Header */}
                    <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                        Wholesaler Details
                    </h2>

                    <div className="mt-4 space-y-2">
                        <div>
                            <TextWrapper variant={'H6'} content={'WHOLESALER_NAME'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (wholesalerName)}>
                            </TextWrapper>
                        </div>
                        <div>
                            <TextWrapper variant={'H6'} content={'WHOLESALER_NAME'}>
                            </TextWrapper>
                            <TextWrapper variant={'Body1'} content={': ' + (wholesalerName)}>
                            </TextWrapper>
                        </div>
                        {invoiceData && invoiceData?.length > 0 && (<div className="p-10 w-full">
                            <CustomTable
                                isRowClickable={false}
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
