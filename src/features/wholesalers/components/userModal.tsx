import TextWrapper from '@components/text/TextWrapper';
import useLocalization from '@core/hooks/useLocalization';
import {Modal, Box, TextField, Button} from '@mui/material';

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
  isUpdate,
}: {
  isOpen: boolean;
  handleCancel: () => void;
  formData: IUserForm;
  handleFormData: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: () => void;
  isUpdate?: boolean;
}) {
  const translate = useLocalization;

  return (
    <Modal open={isOpen} onClose={() => handleCancel()}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {xs: 'calc(100% - 24px)', sm: '440px'},
          maxHeight: 'calc(100dvh - 24px)',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          padding: {xs: '20px 16px', sm: '24px'},
          borderRadius: '16px',
        }}>
        <TextWrapper
          variant={'H5'}
          content={!isUpdate ? 'ADD_USER' : 'UPDATE_USER'}
        />

        {/* Form Fields */}
        <Box display="flex" flexDirection="column" className="mt-4 gap-5">
          <TextField
            className="w-full"
            label={translate({content: 'FIRST_NAME'})}
            name="FirstName"
            value={formData?.FirstName}
            onChange={handleFormData}
            fullWidth
          />
          <TextField
            label={translate({content: 'LAST_NAME'})}
            name="LastName"
            value={formData?.LastName}
            onChange={handleFormData}
            fullWidth
          />
          <TextField
            label={translate({content: 'EMAIL'})}
            name="Email"
            type="string"
            value={formData?.Email}
            onChange={handleFormData}
            fullWidth
          />
          <TextField
            label={translate({content: 'ADDRESS'})}
            name="Address"
            type="string"
            value={formData?.Address}
            onChange={handleFormData}
            fullWidth
          />
          <TextField
            label={translate({content: 'PHONE_NUMBER'})}
            name="Phone"
            type="string"
            value={formData?.Phone}
            onChange={handleFormData}
            fullWidth
          />
          {!isUpdate && (
            <TextField
              label={translate({content: 'PASSWORD'})}
              name="Password"
              type="password"
              autoComplete="new-password"
              autoFocus={false}
              value={formData?.Password}
              onChange={handleFormData}
              fullWidth
            />
          )}
        </Box>

        {/* Buttons */}
        <Box className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleCancel()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit()}>
            {!isUpdate ? 'Save' : 'Update'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
