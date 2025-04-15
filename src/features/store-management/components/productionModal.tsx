import TextWrapper from "@components/text/TextWrapper";
import { IAddProductionPayload } from "@core/interfaces/api/IProduct";
import { useAddProductionMutation, useGetProductQuery } from "@core/store/api/product";
import { Modal, Box, TextField, Button, FormControl, MenuItem } from "@mui/material";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { addProductionValidationSchema } from "../schemas/add-production.schema";
import { useEffect } from "react";

export interface IEachProduction {
    ProductId: string,
    CurrentQuantity: number,
    ProductionAmount: number,
}

export interface IProductionForm {
    ProductionInfo: IEachProduction[];
}

const createProductionInitialValues: IProductionForm = {
    ProductionInfo: [{
        ProductId: '',
        CurrentQuantity: 0,
        ProductionAmount: 0,
    }]
}

export default function ProductionModal({
    isOpen,
    handleClose
}: {
    isOpen: boolean;
    handleClose: () => void;
}) {

    const { data: productData, isLoading: isProductLoading, refetch } = useGetProductQuery({ pageNumber: 1, pageSize: 1000, itemId: '' });
    const [createProduction, { isLoading: isCreating }] = useAddProductionMutation();
    const productList = productData?.Data || [];
    const submitInvoice = async (values: IProductionForm) => {
        let payload: IAddProductionPayload = { ProductionInfo: [] };
        values.ProductionInfo.forEach((item) => {
            if (item.ProductId === '') return;
            payload.ProductionInfo.push({
                ProductId: item.ProductId,
                Quantity: item.CurrentQuantity
            })
        })
        console.log("Payload", payload);
        await createProduction({ payload }).unwrap();
        handleClose();
    }
      useEffect(() => {
        // Refetch when component mounts
        refetch();
      }, [refetch]);

    return (
        <Modal open={isOpen} onClose={() => handleClose()}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 5,
                    borderRadius: 2,
                }}
            >
                <TextWrapper variant={'H5'} content={'ADD_PRODUCTION'} />

                <Formik
                    initialValues={createProductionInitialValues}
                    validationSchema={addProductionValidationSchema}
                    onSubmit={(values) => {
                        console.log("Form data", values);
                    }}
                >
                    {({ values, setFieldValue, errors, touched }) => {
                        const selectedProducts = values.ProductionInfo.map(
                            (product: any) => product.ProductId
                        );

                        return (
                            <Form>

                                {/* Product Information */}
                                <FieldArray
                                    name="ProductionInfo"
                                    render={(arrayHelpers) => (
                                        <div>
                                            {values.ProductionInfo.map((product, index) => (
                                                <div key={index} className="my-4">
                                                    <div className="flex space-x-4">
                                                        {/* Product ID Dropdown */}
                                                        <div className="flex-1">
                                                            <TextField
                                                                label="Product ID"
                                                                name={`ProductionInfo[${index}].ProductId`}
                                                                fullWidth
                                                                variant="outlined"
                                                                select
                                                                value={product.ProductId}
                                                                onChange={(e) => {
                                                                    setFieldValue(`ProductionInfo[${index}].ProductId`, e.target.value);
                                                                    const selectedProduct = productList.find((productOption) => productOption.ItemId === e.target.value);
                                                                    setFieldValue(`ProductionInfo[${index}].CurrentQuantity`, selectedProduct?.Quantity || 0);
                                                                }
                                                                }
                                                            >
                                                                {productList
                                                                    .map((productOption) => (
                                                                        <MenuItem disabled={selectedProducts.indexOf(productOption.ItemId) > -1} key={productOption.ItemId} value={productOption.ItemId}>
                                                                            {productOption.ProductName}
                                                                        </MenuItem>
                                                                    ))}
                                                            </TextField>
                                                            <ErrorMessage name={`ProductionInfo[${index}].ProductId`} component="div" className="text-red-500" />
                                                        </div>
                                                        {/* CurrentQuantity */}
                                                        <div className="flex-1">
                                                            <TextField
                                                                disabled
                                                                label="CurrentQuantity"
                                                                name={`ProductionInfo[${index}].CurrentQuantity`}
                                                                type="number"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={product.CurrentQuantity}
                                                                onChange={(e) =>
                                                                    setFieldValue(`ProductionInfo[${index}].CurrentQuantity`, e.target.value)
                                                                }
                                                            />
                                                            <ErrorMessage name={`ProductionInfo[${index}].CurrentQuantity`} component="div" className="text-red-500" />
                                                        </div>

                                                        {/* ProductionAmount */}
                                                        <div className="flex-1">
                                                            <TextField
                                                                label="ProductionAmount"
                                                                name={`ProductionInfo[${index}].ProductionAmount`}
                                                                type="number"
                                                                fullWidth
                                                                variant="outlined"
                                                                value={product.ProductionAmount}
                                                                onChange={(e) => {
                                                                    setFieldValue(`ProductionInfo[${index}].ProductionAmount`, e.target.value)
                                                                    const currentProdId = values.ProductionInfo[index].ProductId;
                                                                    const selectedProduct = productList.find((productOption) => productOption.ItemId === currentProdId);
                                                                    setFieldValue(`ProductionInfo[${index}].CurrentQuantity`, Number(e.target.value) + Number(selectedProduct?.Quantity || 0));
                                                                }
                                                                }
                                                            />
                                                            <ErrorMessage name={`ProductionInfo[${index}].ProductionAmount`} component="div" className="text-red-500" />
                                                        </div>

                                                        {values.ProductionInfo.length > 1 && (<Button
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
                                                        ProductId: '',
                                                        CurrentQuantity: 0,
                                                        ProductionAmount: 0,
                                                    })
                                                }
                                            >
                                                Add Product
                                            </Button>)}
                                        </div>
                                    )}
                                />

                                {/* Buttons */}
                                <Box display="flex" justifyContent="flex-end" className="gap-4 mt-4">
                                    <Button variant="outlined" color="secondary" onClick={() => handleClose()}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={() => submitInvoice(values)}>
                                        {'Save'}
                                    </Button>
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
            </Box>
        </Modal>
    );
}
