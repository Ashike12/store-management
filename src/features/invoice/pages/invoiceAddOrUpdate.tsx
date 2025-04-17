import { CustomButton } from "@components/button/CustomButton";
import { ICreateInvoicePayload, InvoiceDetailsResponse, IProductSellInfo, IUpdateInvoicePayload } from "@core/interfaces/api/IInvoice";
import { useGetUserQuery } from "@core/store/api";
import { useGetProductQuery } from "@core/store/api/product";
import { Button, MenuItem, Select, TextField, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { invoiceValidationSchema } from "../schemas/invoice-form.schema";
import TextWrapper from "@components/text/TextWrapper";
import { useCreateInvoiceMutation, useGetInvoiceQuery, useUpdateInvoiceMutation } from "@core/store/api/invoiceApi";

const createInvoiceInitialValues: ICreateInvoicePayload = {
  PaymentAmount: 0,
  ProductSellInfo: [{
    ItemId: '',
    ProductId: '',
    Quantity: 0,
    SellingPrice: 0,
    SellingDate: ''
  }],
  WholeSalerId: ''
}

const initialValuesOnUpdate = (invoiceDetails: InvoiceDetailsResponse) => {
  const productSellInfo = invoiceDetails.ProductSellInfo.map((product: IProductSellInfo) => {
    return {
      ItemId: product.ItemId,
      ProductId: product.ProductId,
      Quantity: product.Quantity,
      SellingPrice: product.SellingPrice,
      SellingDate: product.SellingDate
    }
  }
  )
  return {
    PaymentAmount: invoiceDetails.PaymentAmount,
    ProductSellInfo: productSellInfo,
    WholeSalerId: invoiceDetails.WholeSalerId
  }
}

export default function invoiceAddOrUpdate() {
  const navigate = useNavigate();
  let { id } = useParams();
  id = id === 'new' ? '' : id;
  const [searchParams] = useSearchParams();
  const isUpdate = searchParams.get("isUpdate") === "true";
  const { data: productData, isLoading: isProductLoading } = useGetProductQuery({ pageNumber: 1, pageSize: 1000, itemId: '' });
  const { data: userData, isLoading: isUserLoading } = useGetUserQuery({ pageNumber: 1, pageSize: 10, itemId: '' });
  const { data: invoiceData, isLoading: isInvoiceLoading } = useGetInvoiceQuery({ pageNumber: 1, pageSize: 10, itemId: id ?? '' });
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
  const productList = productData?.Data || [];
  const wholesalerList = userData?.Data || [];
  if (isProductLoading || isUserLoading) {
    return <CircularProgress />;
  }

  console.log(invoiceData)

  const handleRedirection = (action: string) => {
    navigate(`/invoice/${action}/${id}`);
  }
  const submitInvoice = async (values: ICreateInvoicePayload) => {
    console.log("Form data", values);
    if (isUpdate) {
      const updatePayload = values as IUpdateInvoicePayload;
      updatePayload.ItemId = id ?? '';
      console.log("Update payload", updatePayload);
      await updateInvoice({ payload: updatePayload }).unwrap();
    } else {
      await createInvoice({ payload: values }).unwrap();
    }
    navigate(`/invoice`);
  }
  return (
    <>
      <div className='w-full'>
        {/* <div className="fixed top-16 w-full h-64 bg-cover bg-center z-0">
                    <img className="w-full h-[200px] object-cover"  src={InvoiceBg} alt="Invocie bg" />
                </div> */}
        {id !== '' && (<CustomButton onClick={() => handleRedirection('details')} className='fixed bottom-4 right-4 ml-4 my-3 cursor-pointer' text={'DETAILS_INVOICE'} variant={'primary'}></CustomButton>)}
        {/* {isUpdate ? (<CustomButton onClick={() => handleRedirection('add')} className='fixed bottom-4 right-36 ml-4 my-3 cursor-pointer' text={'ADD_INVOICE'} variant={'primary'}></CustomButton>) :
        (<CustomButton onClick={() => handleRedirection('update')} className='fixed bottom-4 right-36 ml-4 my-3 cursor-pointer' text={'UPDATE_INVOICE'} variant={'primary'}></CustomButton>)} */}

        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
            {!isUpdate ? 'Invoice Add' : 'Invoice Update'}
          </h2>
          <div className="mt-4 space-y-2">
            <Formik
              initialValues={!isUpdate ? createInvoiceInitialValues : initialValuesOnUpdate(invoiceData?.Data as InvoiceDetailsResponse)}
              validationSchema={invoiceValidationSchema}
              onSubmit={(values) => {
                console.log("Form data", values);
              }}
            >
              {({ values, setFieldValue, errors, touched }) => {
                const selectedProducts = values.ProductSellInfo.map(
                  (product) => product.ProductId
                );

                const calculateTotalAmount = () => {
                  const total = values.ProductSellInfo.reduce((acc, product) => {
                    return acc + product.SellingPrice * product.Quantity;
                  }, 0);
                  return total;
                };
                const totalAmount = calculateTotalAmount();

                return (
                  <Form>
                    {/* Wholesaler Dropdown */}
                    <div className="mb-4">
                      <FormControl fullWidth>
                        <InputLabel>Wholesaler</InputLabel>
                        <Field as={Select} name="WholeSalerId" label="Wholesaler">
                          {wholesalerList.map((wholesaler) => (
                            <MenuItem key={wholesaler.ItemId} value={wholesaler.ItemId}>
                              {wholesaler.DisplayName}
                            </MenuItem>
                          ))}
                        </Field>
                        <ErrorMessage name="WholeSalerId" component="div" className="text-red-500" />
                      </FormControl>
                    </div>

                    {/* Product Information */}
                    <FieldArray
                      name="ProductSellInfo"
                      render={(arrayHelpers) => (
                        <div>
                          {values.ProductSellInfo.map((product, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex space-x-4">
                                {/* Product ID Dropdown */}
                                <div className="flex-1">
                                  <TextField
                                    label="Product ID"
                                    name={`ProductSellInfo[${index}].ProductId`}
                                    fullWidth
                                    variant="outlined"
                                    select
                                    value={product.ProductId + '_' + product.SellingPrice}
                                    onChange={(e) => {
                                      setFieldValue(`ProductSellInfo[${index}].ProductId`, e.target.value.split('_')[0]);
                                      setFieldValue(`ProductSellInfo[${index}].SellingPrice`, e.target.value.split('_')[1]);
                                      setFieldValue(`ProductSellInfo[${index}].Quantity`, 5);
                                    }
                                    }
                                  >
                                    {productList
                                      .map((productOption) => (
                                        <MenuItem disabled={selectedProducts.indexOf(productOption.ItemId) > -1} key={productOption.ItemId} value={productOption.ItemId + '_' + productOption.SellingPrice}>
                                          {productOption.ProductName}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                  <ErrorMessage name={`ProductSellInfo[${index}].ProductId`} component="div" className="text-red-500" />
                                </div>

                                {/* Selling Price */}
                                <div className="flex-1">
                                  <TextField
                                    label="Selling Price"
                                    name={`ProductSellInfo[${index}].SellingPrice`}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={product.SellingPrice}
                                    onChange={(e) =>
                                      setFieldValue(`ProductSellInfo[${index}].SellingPrice`, e.target.value)
                                    }
                                  />
                                  <ErrorMessage name={`ProductSellInfo[${index}].SellingPrice`} component="div" className="text-red-500" />
                                </div>

                                {/* Quantity */}
                                <div className="flex-1">
                                  <TextField
                                    label="Quantity"
                                    name={`ProductSellInfo[${index}].Quantity`}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={product.Quantity}
                                    onChange={(e) =>
                                      setFieldValue(`ProductSellInfo[${index}].Quantity`, e.target.value)
                                    }
                                  />
                                  <ErrorMessage name={`ProductSellInfo[${index}].Quantity`} component="div" className="text-red-500" />
                                </div>

                                {values.ProductSellInfo.length > 1 && (<Button
                                  type="button"
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Remove Product
                                </Button>)}
                              </div>

                            </div>
                          ))}

                          {/* Add Product Button */}
                          {selectedProducts.length != productList.length && (<Button
                            type="button"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              arrayHelpers.push({
                                ProductId: "",
                                Quantity: 0,
                                SellingPrice: 0,
                                SellingDate: "",
                              })
                            }
                          >
                            Add Product
                          </Button>)}
                        </div>
                      )}
                    />

                    {/* Payment Amount */}
                    <div className="flex flex-row gap-4 mt-6">
                      <div className="mb-4 basis-1/2">
                        <TextField
                          label="Payment Amount"
                          name="PaymentAmount"
                          type="number"
                          fullWidth
                          variant="outlined"
                          value={values.PaymentAmount}
                          onChange={(e) => setFieldValue("PaymentAmount", e.target.value)}
                        />
                        <ErrorMessage name="PaymentAmount" component="div" className="text-red-500" />
                      </div>
                      <div className="basis-1/2 border flex items-center border-transparent-grey-24 rounded-md px-4 mb-4">
                        <TextWrapper variant={"Body1"} content={'TOTAL_AMOUNT'}></TextWrapper>:
                        <TextWrapper variant={"Subtitle1Bold"} content={totalAmount}></TextWrapper>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4">
                      <Button onClick={() => submitInvoice(values)} disabled={!values.ProductSellInfo.length || !values.PaymentAmount}
                        type="submit" variant="contained" color="primary">
                        Submit Invoice
                      </Button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}
