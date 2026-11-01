import TextWrapper from '@components/text/TextWrapper';
import {CustomButton} from '@components/button/CustomButton';
import {
  useAddProductionMutation,
  useGetProductQuery,
} from '@core/store/api/product';
import {Alert, Modal, Box, TextField, MenuItem} from '@mui/material';
import {ErrorMessage, FieldArray, Form, Formik} from 'formik';
import {addProductionValidationSchema} from '../schemas/add-production.schema';
import {useEffect, useRef, useState} from 'react';
import {
  buildProductionPayload,
  createInventoryRequestLifecycle,
} from '../inventoryRequest';
import {useListEmployeesQuery} from '@core/store/api/employeeApi';

export interface IEachProduction {
  ProductId: string;
  CurrentQuantity: number;
  ProductionAmount: number;
  MadeByEmployeeId: string;
}

export interface IProductionForm {
  ProductionInfo: IEachProduction[];
}

const createProductionInitialValues: IProductionForm = {
  ProductionInfo: [
    {
      ProductId: '',
      CurrentQuantity: 0,
      ProductionAmount: 0,
      MadeByEmployeeId: '',
    },
  ],
};

export default function ProductionModal({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) {
  const {
    data: productData,
    isLoading: isProductLoading,
    refetch,
  } = useGetProductQuery({pageNumber: 1, pageSize: 1000, itemId: ''});
  const [createProduction, {isLoading: isCreating}] =
    useAddProductionMutation();
  const requestLifecycle = useRef(createInventoryRequestLifecycle());
  const [submissionError, setSubmissionError] = useState('');
  const employees = useListEmployeesQuery({
    Status: 'active',
    Page: 1,
    Size: 100,
  });
  const productList = productData?.Data || [];
  const submitInvoice = async (values: IProductionForm) => {
    setSubmissionError('');
    const payload = buildProductionPayload(
      values,
      requestLifecycle.current.begin(),
    );
    try {
      await createProduction({payload}).unwrap();
      requestLifecycle.current.end();
      handleClose();
    } catch {
      setSubmissionError('Production could not be saved. Please try again.');
    }
  };
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
          position: 'absolute',
          top: {xs: 0, sm: '50%'},
          left: '50%',
          transform: {xs: 'translateX(-50%)', sm: 'translate(-50%, -50%)'},
          width: {xs: '100%', sm: 'calc(100% - 32px)', lg: 'min(1040px, 82vw)'},
          height: {xs: '100dvh', sm: 'auto'},
          maxHeight: {sm: 'calc(100dvh - 32px)'},
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          padding: {
            xs: '18px 16px calc(18px + env(safe-area-inset-bottom))',
            sm: '24px',
          },
          borderRadius: {xs: 0, sm: '16px'},
        }}>
        <TextWrapper variant={'H5'} content={'ADD_PRODUCTION'} />

        <Formik
          initialValues={createProductionInitialValues}
          validationSchema={addProductionValidationSchema}
          onSubmit={submitInvoice}>
          {({values, setFieldValue}) => {
            const selectedProducts = values.ProductionInfo.map(
              product => product.ProductId,
            );

            return (
              <Form>
                {/* Product Information */}
                <FieldArray
                  name="ProductionInfo"
                  render={arrayHelpers => (
                    <div>
                      {values.ProductionInfo.map((product, index) => (
                        <div
                          key={index}
                          className="my-4 rounded-xl border border-[var(--palette-divider)] p-3 sm:p-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {/* Product ID Dropdown */}
                            <div className="flex-1">
                              <TextField
                                label="Product ID"
                                name={`ProductionInfo[${index}].ProductId`}
                                fullWidth
                                variant="outlined"
                                select
                                value={product.ProductId}
                                onChange={e => {
                                  setFieldValue(
                                    `ProductionInfo[${index}].ProductId`,
                                    e.target.value,
                                  );
                                  const selectedProduct = productList.find(
                                    productOption =>
                                      productOption.ItemId === e.target.value,
                                  );
                                  setFieldValue(
                                    `ProductionInfo[${index}].CurrentQuantity`,
                                    selectedProduct?.Quantity || 0,
                                  );
                                }}>
                                {productList.map(productOption => (
                                  <MenuItem
                                    disabled={
                                      selectedProducts.indexOf(
                                        productOption.ItemId,
                                      ) > -1
                                    }
                                    key={productOption.ItemId}
                                    value={productOption.ItemId}>
                                    {productOption.ProductName}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <ErrorMessage
                                name={`ProductionInfo[${index}].ProductId`}
                                component="div"
                                className="text-red-500"
                              />
                            </div>

                            <div className="flex-1">
                              <TextField
                                label="Made by (optional)"
                                name={`ProductionInfo[${index}].MadeByEmployeeId`}
                                fullWidth
                                select
                                value={product.MadeByEmployeeId}
                                onChange={e =>
                                  setFieldValue(
                                    `ProductionInfo[${index}].MadeByEmployeeId`,
                                    e.target.value,
                                  )
                                }
                                helperText="Batch attribution only">
                                <MenuItem value="">Not assigned</MenuItem>
                                {employees.data?.Data.map(employee => (
                                  <MenuItem
                                    key={employee.ItemId}
                                    value={employee.ItemId}>
                                    {employee.DisplayName}
                                  </MenuItem>
                                ))}
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
                                onChange={e =>
                                  setFieldValue(
                                    `ProductionInfo[${index}].CurrentQuantity`,
                                    e.target.value,
                                  )
                                }
                              />
                              <ErrorMessage
                                name={`ProductionInfo[${index}].CurrentQuantity`}
                                component="div"
                                className="text-red-500"
                              />
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
                                onChange={e => {
                                  setFieldValue(
                                    `ProductionInfo[${index}].ProductionAmount`,
                                    e.target.value,
                                  );
                                }}
                              />
                              <ErrorMessage
                                name={`ProductionInfo[${index}].ProductionAmount`}
                                component="div"
                                className="text-red-500"
                              />
                            </div>

                            {values.ProductionInfo.length > 1 && (
                              <div className="sm:col-span-2 xl:col-span-4">
                                <CustomButton
                                  type="button"
                                  variant="outline"
                                  size="lg"
                                  text="Remove Product"
                                  onClick={() => arrayHelpers.remove(index)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Product Button */}
                      {selectedProducts.length !== productList.length && (
                        <CustomButton
                          type="button"
                          variant="outline"
                          size="lg"
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
                <Box className="sticky bottom-0 mt-5 flex flex-col-reverse gap-3 border-t border-[var(--palette-divider)] bg-[var(--palette-background-paper)] pt-4 sm:flex-row sm:justify-end">
                  <CustomButton
                    variant="secondary"
                    size="lg"
                    text="Cancel"
                    onClick={closeModal}
                  />
                  <CustomButton
                    variant="primary"
                    size="lg"
                    text="Save"
                    type="submit"
                    disabled={isCreating || isProductLoading}
                    loading={isCreating}
                  />
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Modal>
  );
}
