import TextWrapper from "@components/text/TextWrapper";
import useLocalization from "@core/hooks/useLocalization";
import { Modal, Box, TextField, Button } from "@mui/material";

export interface IProductForm {
    ItemId: string;
    ProductName: string;
    Description: string;
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
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 5,
                    borderRadius: 2,
                }}
            >
                <TextWrapper variant={'H5'} content = {!isUpdate ? 'ADD_PRODUCT' : 'UPDATE_PRODUCT'}/>

                {/* Form Fields */}
                <Box display="flex" flexDirection="column" className="gap-5 mt-4">
                    <TextField
                        className="w-full"
                        label={useTranslation({content:'PRODUCT_NAME'})}
                        name="ProductName"
                        value={formData?.ProductName}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'PRODUCT_DESCRIPTION'})}
                        name="Description"
                        value={formData?.Description}
                        onChange={handleFormData}
                        fullWidth
                        rows={2}
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
                    <Button variant="outlined" color="secondary" onClick={() => handleCancel()}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
                        {!isUpdate ? 'Save' : 'Update'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
