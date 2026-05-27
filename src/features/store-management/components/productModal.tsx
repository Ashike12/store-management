import TextWrapper from "@components/text/TextWrapper";
import { CustomButton } from "@components/button/CustomButton";
import useLocalization from "@core/hooks/useLocalization";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_SUBCATEGORY_MAP } from "@core/config/product-category.constants";
import { Modal, Box, MenuItem, SelectChangeEvent, TextField } from "@mui/material";

export interface IProductForm {
    ItemId: string;
    ProductName: string;
    Category: string;
    SubCategory: string;
    Description: string;
    ImageLinks: string;
    VideoLink: string;
    MakingPrice: string;
    WholeSalerPrice: string;
    EndUserPrice: string;
    EndUserDiscountedPrice: string;
    Quantity: string;
}

export default function ProductModal({
    isOpen,
    handleCancel,
    formData,
    handleFormData,
    handleSubmit,
    isUpdate
}: {
    isOpen: boolean;
    handleCancel: () => void;
    formData: IProductForm;
    handleFormData: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => void;
    handleSubmit: () => void;
    isUpdate?: boolean;
}) {

    const useTranslation = useLocalization;
    const subCategoryOptions = PRODUCT_CATEGORY_SUBCATEGORY_MAP[formData?.Category] ?? [];
    const hasCustomSubCategory = !!formData?.SubCategory && !subCategoryOptions.includes(formData.SubCategory);

    return (
        <Modal open={isOpen} onClose={() => handleCancel()}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "calc(100% - 32px)", md: 820 },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 5,
                    borderRadius: 2,
                }}
            >
                <TextWrapper variant={'H5'} content = {!isUpdate ? 'ADD_PRODUCT' : 'UPDATE_PRODUCT'}/>

                {/* Form Fields */}
                <Box
                    sx={{
                        mt: 4,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 4,
                    }}
                >
                    <TextField
                        label={useTranslation({content:'PRODUCT_NAME'})}
                        name="ProductName"
                        value={formData?.ProductName}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label="Category"
                        name="Category"
                        value={formData?.Category}
                        onChange={handleFormData}
                        select
                        fullWidth
                    >
                        <MenuItem value="">Select Category</MenuItem>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Sub Category"
                        name="SubCategory"
                        value={formData?.SubCategory}
                        onChange={handleFormData}
                        select
                        disabled={!formData?.Category}
                        fullWidth
                    >
                        <MenuItem value="">Select Sub Category</MenuItem>
                        {subCategoryOptions.map((subCategory) => (
                            <MenuItem key={subCategory} value={subCategory}>
                                {subCategory}
                            </MenuItem>
                        ))}
                        {hasCustomSubCategory && (
                            <MenuItem value={formData.SubCategory}>{formData.SubCategory}</MenuItem>
                        )}
                    </TextField>
                    <TextField
                        label={useTranslation({content:'MAKING_COST'})}
                        name="MakingPrice"
                        type="number"
                        value={formData?.MakingPrice}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label="Wholesaler Price"
                        name="WholeSalerPrice"
                        type="number"
                        value={formData?.WholeSalerPrice}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label="End User Price"
                        name="EndUserPrice"
                        type="number"
                        value={formData?.EndUserPrice}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label="End User Discounted Price"
                        name="EndUserDiscountedPrice"
                        type="number"
                        value={formData?.EndUserDiscountedPrice}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'QUANTITY'})}
                        name="Quantity"
                        type="number"
                        value={formData?.Quantity}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'PRODUCT_VIDEO_LINK'})}
                        name="VideoLink"
                        value={formData?.VideoLink}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'PRODUCT_DESCRIPTION'})}
                        name="Description"
                        value={formData?.Description}
                        onChange={handleFormData}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
                    />
                    <TextField
                        label={`${useTranslation({content:'PRODUCT_IMAGE_LINK'})} (one per line)`}
                        name="ImageLinks"
                        value={formData?.ImageLinks}
                        onChange={handleFormData}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
                    />
                </Box>

                {/* Buttons */}
                <Box display="flex" justifyContent="flex-end" className="gap-4 mt-4">
                    <CustomButton
                        variant="secondary"
                        size="md"
                        text="Cancel"
                        onClick={() => handleCancel()}
                    />
                    <CustomButton
                        variant="primary"
                        size="md"
                        text={!isUpdate ? 'Save' : 'Update'}
                        onClick={() => handleSubmit()}
                    />
                </Box>
            </Box>
        </Modal>
    );
}
