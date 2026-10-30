import TextWrapper from "@components/text/TextWrapper";
import { CustomButton } from "@components/button/CustomButton";
import { useAddProductionMutation, useGetProductQuery } from "@core/store/api/product";
import { Alert, Modal, Box, TextField, MenuItem } from "@mui/material";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { addProductionValidationSchema } from "../schemas/add-production.schema";
import { useEffect, useRef, useState } from "react";
import { buildProductionPayload, createInventoryRequestLifecycle } from "../inventoryRequest";
import {useListEmployeesQuery} from "@core/store/api/employeeApi";

export interface IEachProduction {
    ProductId: string,
    CurrentQuantity: number,
    ProductionAmount: number,
    MadeByEmployeeId: string,
}

export interface IProductionForm {
    ProductionInfo: IEachProduction[];
}

const createProductionInitialValues: IProductionForm = {
    ProductionInfo: [{
        ProductId: '',
        CurrentQuantity: 0,
        ProductionAmount: 0,
        MadeByEmployeeId: '',
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
    const requestLifecycle = useRef(createInventoryRequestLifecycle());
    const [submissionError, setSubmissionError] = useState('');
    const employees = useListEmployeesQuery({Status: 'active', Page: 1, Size: 100});
    const productList = productData?.Data || [];
    const submitInvoice = async (values: IProductionForm) => {
        setSubmissionError('');
        const payload = buildProductionPayload(values, requestLifecycle.current.begin());
        try {
            await createProduction({ payload }).unwrap();
            requestLifecycle.current.end();
            handleClose();
        } catch {
            setSubmissionError('Production could not be saved. Please try again.');
        }
    }
    const closeModal = () => {
        requestLifecycle.current.end();
        handleClose();
    };
      useEffect(() => {
        // Refetch when component mounts
        refetch();
      }, [refetch]);

    return (
        <Modal open={isOpen} onClose={closeModal}>
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
                    onSubmit={submitInvoice}
                >
                    {({ values, setFieldValue }) => {
                        const selectedProducts = values.ProductionInfo.map(
                            product => product.ProductId
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

                                                        <div className="flex-1">
                                                            <TextField
                                                                label="Made by (optional)"
                                                                name={`ProductionInfo[${index}].MadeByEmployeeId`}
                                                                fullWidth
                                                                select
                                                                value={product.MadeByEmployeeId}
                                                                onChange={(e) => setFieldValue(`ProductionInfo[${index}].MadeByEmployeeId`, e.target.value)}
                                                                helperText="Batch attribution only"
                                                            >
                                                                <MenuItem value="">Not assigned</MenuItem>
                                                                {employees.data?.Data.map(employee => <MenuItem key={employee.ItemId} value={employee.ItemId}>{employee.DisplayName}</MenuItem>)}
                                                            </TextField>
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
                                                                }
                                                                }
                                                            />
                                                            <ErrorMessage name={`ProductionInfo[${index}].ProductionAmount`} component="div" className="text-red-500" />
                                                        </div>

                                                        {values.ProductionInfo.length > 1 && (
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

                                            {/* Add Product Button */}
                                            {selectedProducts.length !== productList.length && (
                                                <CustomButton
                                                    type="button"
                                                    variant="outline"
                                                    size="md"
                                                    text="Add Product"
                                                    onClick={() =>
                                                        arrayHelpers.push({
                                                            ProductId: '',
                                                            CurrentQuantity: 0,
                                                            ProductionAmount: 0,
                                                            MadeByEmployeeId: '',
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Buttons */}
                                {submissionError && (
                                    <Alert severity="error" role="alert" className="mt-4">
                                        {submissionError}
                                    </Alert>
                                )}
                                <Box display="flex" justifyContent="flex-end" className="gap-4 mt-4">
                                    <CustomButton
                                        variant="secondary"
                                        size="md"
                                        text="Cancel"
                                        onClick={closeModal}
                                    />
                                    <CustomButton
                                        variant="primary"
                                        size="md"
                                        text="Save"
                                        type="submit"
                                        disabled={isCreating || isProductLoading}
                                        loading={isCreating}
                                    />
                                </Box>
                            </Form>
                        )
                    }}
                </Formik>
            </Box>
        </Modal>
    );
}
