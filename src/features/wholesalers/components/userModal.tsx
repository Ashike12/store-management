import TextWrapper from "@components/text/TextWrapper";
import useLocalization from "@core/hooks/useLocalization";
import { Modal, Box, TextField, Button } from "@mui/material";

export interface IUserForm {
    ItemId: string;
    Active: boolean;
    FirstName: string;
    LastName: string;
    Email: string;
    Address: string;
    Phone: string;
    Password: string;
}

export default function UserModal({
    isOpen,
    handleCancel,
    formData,
    handleFormData,
    handleSubmit,
    isUpdate
}: {
    isOpen: boolean;
    handleCancel: () => void;
    formData: IUserForm;
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
                <TextWrapper variant={'H5'} content = {!isUpdate ? 'ADD_USER' : 'UPDATE_USER'}/>

                {/* Form Fields */}
                <Box display="flex" flexDirection="column" className="gap-5 mt-4">
                    <TextField
                        className="w-full"
                        label={useTranslation({content:'FIRST_NAME'})}
                        name="FirstName"
                        value={formData?.FirstName}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'LAST_NAME'})}
                        name="LastName"
                        value={formData?.LastName}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'EMAIL'})}
                        name="Email"
                        type="string"
                        value={formData?.Email}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'ADDRESS'})}
                        name="Address"
                        type="string"
                        value={formData?.Address}
                        onChange={handleFormData}
                        fullWidth
                    />
                    <TextField
                        label={useTranslation({content:'PHONE_NUMBER'})}
                        name="Phone"
                        type="string"
                        value={formData?.Phone}
                        onChange={handleFormData}
                        fullWidth
                    />
                    {!isUpdate && (<TextField
                        label={useTranslation({content:'PASSWORD'})}
                        name="Password"
                        type="password"
                        autoComplete="new-password"
                        autoFocus={false}
                        value={formData?.Password}
                        onChange={handleFormData}
                        fullWidth
                    />)}
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
