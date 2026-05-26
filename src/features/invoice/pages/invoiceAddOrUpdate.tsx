import {CustomButton} from "@components/button/CustomButton";
import TextWrapper from "@components/text/TextWrapper";
import {
  ICreateInvoicePayload,
  InvoiceDetailsResponse,
  IProductSellInfo,
  IUpdateInvoicePayload,
} from "@core/interfaces/api/IInvoice";
import {useGetUserQuery} from "@core/store/api";
import {useCreateInvoiceMutation, useGetInvoiceQuery, useUpdateInvoiceMutation} from "@core/store/api/invoiceApi";
import {useGetProductQuery} from "@core/store/api/product";
import {useTheme} from "@mui/material/styles";
import {CircularProgress, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField} from "@mui/material";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {invoiceValidationSchema} from "../schemas/invoice-form.schema";

const EMPTY_PRODUCT_ROW: IProductSellInfo = {
  ItemId: "",
  ProductId: "",
  Quantity: 0,
  SellingPrice: 0,
  SellingDate: "",
};

const createInvoiceInitialValues: ICreateInvoicePayload = {
  PaymentAmount: 0,
  ProductSellInfo: [{...EMPTY_PRODUCT_ROW}],
  WholeSalerId: "",
  InvoiceType: "WHOLESALE",
};

const initialValuesOnUpdate = (
  invoiceDetails?: InvoiceDetailsResponse,
): ICreateInvoicePayload => {
  if (!invoiceDetails) {
    return createInvoiceInitialValues;
  }

  const productSellInfo = (invoiceDetails.ProductSellInfo || []).map((product: IProductSellInfo) => ({
    ItemId: product.ItemId,
    ProductId: product.ProductId,
    Quantity: product.Quantity,
    SellingPrice: product.SellingPrice,
    SellingDate: product.SellingDate,
  }));

  const currentInvoiceType = invoiceDetails.InvoiceType || "WHOLESALE";
  const isDuePayment = currentInvoiceType === "DUE_PAYMENT";

  return {
    PaymentAmount: invoiceDetails.PaymentAmount || 0,
    ProductSellInfo: isDuePayment
      ? []
      : (productSellInfo.length > 0 ? productSellInfo : [{...EMPTY_PRODUCT_ROW}]),
    WholeSalerId: invoiceDetails.WholeSalerId || "",
    InvoiceType: isDuePayment ? "DUE_PAYMENT" : currentInvoiceType,
  };
};

export default function InvoiceAddOrUpdate() {
  const theme = useTheme();
  const navigate = useNavigate();
  let {id} = useParams();
  id = id === "new" ? "" : id;

  const [searchParams] = useSearchParams();
  const isUpdate = searchParams.get("isUpdate") === "true";
  const preselectedWholesalerId = searchParams.get("wholesalerId") || "";
  const {data: productData, isLoading: isProductLoading} = useGetProductQuery({
    pageNumber: 1,
    pageSize: 1000,
    itemId: "",
  });
  const {data: userData, isLoading: isUserLoading} = useGetUserQuery({
    pageNumber: 1,
    pageSize: 10,
    itemId: "",
  });
  const {data: invoiceData, isLoading: isInvoiceLoading} = useGetInvoiceQuery({
    pageNumber: 1,
    pageSize: 10,
    itemId: id ?? "",
  });

  const [createInvoice] = useCreateInvoiceMutation();
  const [updateInvoice] = useUpdateInvoiceMutation();

  const productList = productData?.Data || [];
  const wholesalerList = userData?.Data || [];

  if (isProductLoading || isUserLoading || (isUpdate && isInvoiceLoading)) {
    return <CircularProgress />;
  }

  const handleRedirection = (action: string) => {
    navigate(`/invoice/${action}/${id}`);
  };

  const submitInvoice = async (values: ICreateInvoicePayload) => {
    const isDuePaymentInvoice = values.InvoiceType === "DUE_PAYMENT";
    const normalizedInvoiceType = isDuePaymentInvoice
      ? "DUE_PAYMENT"
      : (values.WholeSalerId ? "WHOLESALE" : "CONSUMER");

    const payload: ICreateInvoicePayload = {
      ...values,
      InvoiceType: normalizedInvoiceType,
      ProductSellInfo: isDuePaymentInvoice ? [] : values.ProductSellInfo,
    };

    if (isUpdate) {
      const updatePayload = payload as IUpdateInvoicePayload;
      updatePayload.ItemId = id ?? "";
      await updateInvoice({payload: updatePayload}).unwrap();
    } else {
      await createInvoice({payload}).unwrap();
    }

    navigate(`/invoice`);
  };

  const initialValues = !isUpdate
    ? {
        ...createInvoiceInitialValues,
        WholeSalerId: preselectedWholesalerId,
      }
    : initialValuesOnUpdate(invoiceData?.Data as InvoiceDetailsResponse | undefined);

  return (
    <div className="w-full">
      {id !== "" && (
        <CustomButton
          onClick={() => handleRedirection("details")}
          className="cursor-pointer"
          sx={{position: "fixed", bottom: 16, right: 16, zIndex: 1200}}
          text={"DETAILS_INVOICE"}
          variant={"primary"}
        />
      )}

      <div
        className="max-w-3xl mx-auto p-6 shadow-lg rounded-xl mt-10"
        style={{
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
        }}>
        <h2
          className="text-2xl font-bold border-b pb-3"
          style={{
            color: theme.vars.palette.text.primary,
            borderColor: theme.vars.palette.divider,
          }}>
          {!isUpdate ? "Invoice Add" : "Invoice Update"}
        </h2>

        <div className="mt-4 space-y-2">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={invoiceValidationSchema}
            onSubmit={submitInvoice}>
            {({values, setFieldValue, isValid, dirty, isSubmitting}) => {
              const isDuePaymentInvoice = values.InvoiceType === "DUE_PAYMENT";
              const selectedProducts = values.ProductSellInfo.map(product => product.ProductId);

              const totalAmount = isDuePaymentInvoice
                ? 0
                : values.ProductSellInfo.reduce((acc, product) => {
                    return acc + product.SellingPrice * product.Quantity;
                  }, 0);

              return (
                <Form>
                  <div className="mb-4">
                    <Tabs
                      value={isDuePaymentInvoice ? "DUE_PAYMENT" : "WHOLESALE"}
                      onChange={(_, nextValue: string) => {
                        setFieldValue("InvoiceType", nextValue);
                        if (nextValue === "DUE_PAYMENT") {
                          setFieldValue("ProductSellInfo", []);
                        } else if (!values.ProductSellInfo.length) {
                          setFieldValue("ProductSellInfo", [{...EMPTY_PRODUCT_ROW}]);
                        }
                      }}
                      sx={{
                        borderBottom: `1px solid ${theme.vars.palette.divider}`,
                        mb: 2,
                      }}>
                      <Tab value="WHOLESALE" label="Product Invoice" />
                      <Tab value="DUE_PAYMENT" label="Due Payment Invoice" />
                    </Tabs>
                  </div>

                  <div className="mb-4">
                    <FormControl fullWidth>
                      <InputLabel>Wholesaler</InputLabel>
                      <Field as={Select} name="WholeSalerId" label="Wholesaler">
                        {wholesalerList.map(wholesaler => (
                          <MenuItem key={wholesaler.ItemId} value={wholesaler.ItemId}>
                            {wholesaler.DisplayName}
                          </MenuItem>
                        ))}
                      </Field>
                      <ErrorMessage name="WholeSalerId" component="div" className="text-red-500" />
                    </FormControl>
                  </div>

                  {!isDuePaymentInvoice && (
                    <FieldArray
                      name="ProductSellInfo"
                      render={arrayHelpers => (
                        <div>
                          {values.ProductSellInfo.map((product, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex space-x-4">
                                <div className="flex-1">
                                  <TextField
                                    label="Product ID"
                                    name={`ProductSellInfo[${index}].ProductId`}
                                    fullWidth
                                    variant="outlined"
                                    select
                                    value={product.ProductId + "_" + product.SellingPrice}
                                    onChange={e => {
                                      const [productId, sellingPrice] = e.target.value.split("_");
                                      setFieldValue(`ProductSellInfo[${index}].ProductId`, productId);
                                      setFieldValue(`ProductSellInfo[${index}].SellingPrice`, sellingPrice);
                                      setFieldValue(`ProductSellInfo[${index}].Quantity`, 1);
                                    }}>
                                    {productList.map(productOption => (
                                      <MenuItem
                                        disabled={selectedProducts.indexOf(productOption.ItemId) > -1}
                                        key={productOption.ItemId}
                                        value={productOption.ItemId + "_" + productOption.SellingPrice}>
                                        {productOption.ProductName}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  <ErrorMessage
                                    name={`ProductSellInfo[${index}].ProductId`}
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                <div className="flex-1">
                                  <TextField
                                    label="Selling Price"
                                    name={`ProductSellInfo[${index}].SellingPrice`}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={product.SellingPrice}
                                    onChange={e =>
                                      setFieldValue(`ProductSellInfo[${index}].SellingPrice`, e.target.value)
                                    }
                                  />
                                  <ErrorMessage
                                    name={`ProductSellInfo[${index}].SellingPrice`}
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                <div className="flex-1">
                                  <TextField
                                    label="Quantity"
                                    name={`ProductSellInfo[${index}].Quantity`}
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={product.Quantity}
                                    onChange={e =>
                                      setFieldValue(`ProductSellInfo[${index}].Quantity`, e.target.value)
                                    }
                                  />
                                  <ErrorMessage
                                    name={`ProductSellInfo[${index}].Quantity`}
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                {values.ProductSellInfo.length > 1 && (
                                  <CustomButton
                                    type="button"
                                    variant="outline"
                                    size="md"
                                    text="Remove Product"
                                    onClick={() => arrayHelpers.remove(index)}
                                  />
                                )}
                              </div>
                            </div>
                          ))}

                          {selectedProducts.length !== productList.length && (
                            <CustomButton
                              type="button"
                              variant="outline"
                              size="md"
                              text="Add Product"
                              onClick={() =>
                                arrayHelpers.push({
                                  ...EMPTY_PRODUCT_ROW,
                                })
                              }
                            />
                          )}
                        </div>
                      )}
                    />
                  )}

                  <div className="flex flex-row gap-4 mt-6">
                    <div className="mb-4 basis-1/2">
                      <TextField
                        label="Payment Amount"
                        name="PaymentAmount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={values.PaymentAmount}
                        onChange={e => setFieldValue("PaymentAmount", e.target.value)}
                      />
                      <ErrorMessage name="PaymentAmount" component="div" className="text-red-500" />
                    </div>
                    <div className="basis-1/2 border flex items-center border-transparent-grey-24 rounded-md px-4 mb-4">
                      <TextWrapper variant={"Body1"} content={"TOTAL_AMOUNT"} />
                      :
                      <TextWrapper variant={"Subtitle1Bold"} content={totalAmount} />
                    </div>
                  </div>

                  {isDuePaymentInvoice && (
                    <div className="mb-3 rounded-md px-3 py-2" style={{backgroundColor: theme.vars.palette.background.neutral}}>
                      <TextWrapper
                        variant={"Body2"}
                        content={"Due payment invoice records paid amount without adding products."}
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <CustomButton
                      disabled={!isValid || isSubmitting || (!dirty && !isUpdate)}
                      type="submit"
                      text="Submit Invoice"
                      variant="primary"
                      size="md"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
