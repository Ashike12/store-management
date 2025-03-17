import {Menu, MenuItem, Divider, ListItemIcon} from '@mui/material';
import './ProfileMenu.css';
import IconUser from '@assets/icons/IconUser';
import IconWrench from '@assets/icons/IconWrench';
import IconSignOut from '@assets/icons/IconSignOut';
import TextWrapper from '@components/text/TextWrapper';
import {useState} from 'react';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import useLogOut from '@core/hooks/useLogOut';

interface IProfileMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function ProfileMenu({
  anchorEl,
  open,
  onClose,
}: IProfileMenuProps) {
  const [openModal, setOpenModal] = useState(false);
  const onLogout = useLogOut();

  const openLogoutConfirmModal = () => {
    setOpenModal(true);
  };

  const closeLogoutConfirmModal = () => {
    onClose();
    setOpenModal(false);
  };

  return (
    <Menu
      className="profile-menu-override"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      transformOrigin={{vertical: 'top', horizontal: 'right'}}
      disableScrollLock
      slotProps={{
        paper: {
          sx: {
            minWidth: 223,
            borderRadius: '2px',
            boxShadow:
              '0px 0px 2px 0px rgba(145, 158, 171, 0.10), 0px 12px 24px -4px rgba(145, 158, 171, 0.15);',
            padding: '8px 8px',
            marginTop: '6px',
          },
        },
      }}>
      <MenuItem
        onClick={onClose}
        className="hover:!bg-transparent-interaction-16 active:!bg-transparent-interaction-16 !w-full !gap-2 !rounded-sm !px-[12px] !py-[10px]">
        <ListItemIcon className="!min-w-auto">
          <IconUser />
        </ListItemIcon>
        <TextWrapper
          content={'PROFILE'}
          variant={'ComponentButtonMedium'}
          className="text-interaction-main"
        />
      </MenuItem>
      <MenuItem
        onClick={onClose}
        className="hover:!bg-transparent-interaction-16 active:!bg-transparent-interaction-16 !w-full !gap-2 !rounded-sm !px-[12px] !py-[10px]">
        <ListItemIcon className="!min-w-auto">
          <IconWrench />
        </ListItemIcon>
        <TextWrapper
          content={'SETTINGS'}
          variant={'ComponentButtonMedium'}
          className="text-interaction-main"
        />
      </MenuItem>
      <Divider className="!border-transparent-grey-16" />
      <MenuItem
        onClick={openLogoutConfirmModal}
        className="hover:!bg-transparent-interaction-16 active:!bg-transparent-interaction-16 !w-full !gap-2 !rounded-sm !px-[12px] !py-[10px]">
        <ListItemIcon className="!min-w-auto">
          <IconSignOut />
        </ListItemIcon>
        <TextWrapper
          content={'LOG_OUT'}
          variant={'ComponentButtonMedium'}
          className="text-error-dark"
        />
      </MenuItem>
      <LogoutConfirmationModal
        open={openModal}
        onClose={closeLogoutConfirmModal}
        onLogout={onLogout}
      />
    </Menu>
  );
}
