import TextWrapper from '@components/text/TextWrapper';
import {Box, Modal} from '@mui/material';
import './LogoutConfirmationModal.css';
import {CustomButton} from '@components/button/CustomButton';

interface ILogoutConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutConfirmationModal({
  open,
  onClose,
  onLogout,
}: Readonly<ILogoutConfirmationModalProps>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box className="modal flex flex-col">
        <TextWrapper
          content={'ARE_YOU_SURE'}
          variant={'H5'}
          className="text-text-primary pb-2"
        />
        <div className="pb-6">
          <TextWrapper
            content={'LOG_OUT_OF'}
            variant={'Body1'}
            className="text-text-secondary"
          />{' '}
          <TextWrapper
            content={'peterkeller@helsana.com?'}
            variant={'Body1'}
            className="text-text-secondary"
          />{' '}
          <TextWrapper
            content={'ALL_UNSAVED_CHANGES_WILL_BE_LOST'}
            variant={'Body1'}
            className="text-text-secondary"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <CustomButton
            variant={'ghost'}
            text="CANCEL"
            onClick={onClose}
            className="text-interaction-main h-[44px] w-[100px] rounded-sm text-[13px] leading-[24px] font-[510]"
          />
          <CustomButton
            variant={'outline'}
            text="LOG_OUT"
            onClick={onLogout}
            className="text-error-dark border-error-dark hover:bg-transparent-primary-12 h-[44px] w-[100px] rounded-sm text-[13px] leading-[24px] font-[510]"
          />
        </div>
      </Box>
    </Modal>
  );
}
