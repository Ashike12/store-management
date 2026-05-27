import TextWrapper from "@components/text/TextWrapper";
import { CustomButton } from "@components/button/CustomButton";
import useLocalization from "@core/hooks/useLocalization";
import { Modal, Box, TextField } from "@mui/material";

export interface IProductForm {
    ItemId: string;
    ProductName: string;
    Description: string;
    ImageLinks: string;
    VideoLink: string;
    MakingPrice: string;
    SellingPrice: string;
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
    handleFormData: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    isUpdate?: boolean;
}) {

    const useTranslation = useLocalization;

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
                        mt: 2,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
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
                    <TextField
                        label={useTranslation({content:'MAKING_COST'})}
                        name="MakingPrice"
                        type="number"
                        value={formData?.MakingPrice}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'SELLING_COST'})}
                        name="SellingPrice"
                        type="number"
                        value={formData?.SellingPrice}
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
