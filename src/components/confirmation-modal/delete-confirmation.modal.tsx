import TextWrapper from '@components/text/TextWrapper';
import { Box, Button, Modal } from '@mui/material'
import { IconAlertTriangle } from '@tabler/icons-react';

export default function DeleteConfirmationModal({
    isOpen,
    handleConfirm
}: {
    isOpen: boolean;
    handleConfirm: (open: boolean) => void;
}) {
    return (
        <>
            <Modal open={isOpen} onClose={() => handleConfirm(false)}>
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
                    <div className='p-5 m-5 item flex flex-col gap-4 items-center justify-center'>
                        <IconAlertTriangle color='red' className="w-6 h-6 mr-2" />
                        <TextWrapper className='center' variant={'H5'} content={'ARE_YOU_SURE_TO_DELETE'}></TextWrapper>
                    </div>

                    {/* Buttons */}
                    <Box display="flex" justifyContent="flex-end" className="gap-4 mt-4">
                        <Button variant="outlined" color="secondary" onClick={() => handleConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => handleConfirm(true)} color="primary">
                            {'CONFIRM'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}
