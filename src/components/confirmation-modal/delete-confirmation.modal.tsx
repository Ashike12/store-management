import TextWrapper from '@components/text/TextWrapper';
import {Box, Button, Modal} from '@mui/material';
import {IconAlertTriangle} from '@tabler/icons-react';

export default function DeleteConfirmationModal({
  isOpen,
  handleConfirm,
}: {
  isOpen: boolean;
  handleConfirm: (open: boolean) => void;
}) {
  return (
    <>
      <Modal open={isOpen} onClose={() => handleConfirm(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {xs: 'calc(100% - 24px)', sm: '400px'},
            bgcolor: 'background.paper',
            boxShadow: 24,
            padding: {xs: '20px 16px', sm: '24px'},
            borderRadius: '16px',
          }}>
          <div className="flex flex-col items-center justify-center gap-4 px-2 py-5 text-center sm:px-5">
            <IconAlertTriangle color="red" className="mr-2 h-6 w-6" />
            <TextWrapper
              className="center"
              variant={'H5'}
              content={'ARE_YOU_SURE_TO_DELETE'}></TextWrapper>
          </div>

          {/* Buttons */}
          <Box className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConfirm(true)}
              color="primary">
              {'CONFIRM'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
