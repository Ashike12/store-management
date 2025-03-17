import {AppBar as MuiAppBar, Toolbar, IconButton, Avatar} from '@mui/material';
import {styled} from '@mui/material/styles';
import IconSettingsHeader from '@assets/icons/IconSettingsHeader';
import IconNotificationHeader from '@assets/icons/IconNotificationHeader';
import TextWrapper from '@components/text/TextWrapper';
import useGetHeaderTitle from '@core/hooks/useGetHeaderTitle';
import cn from '@core/utils/cn';
import './header.css';
import {DRAWER_WIDTH} from '@core/config/constants';
import {useState} from 'react';
import ProfileMenu from './ProfileMenu';

interface IHeaderProps {
  isLocked: boolean;
  open?: boolean;
}

const AppBar = styled(MuiAppBar)(({theme}) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Header({isLocked, open}: Readonly<IHeaderProps>) {
  const headerInfo = useGetHeaderTitle();
  const drawerStyle =
    open && isLocked ? {left: DRAWER_WIDTH, width: 'auto'} : {};
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const toggleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    if (anchorEl) handleMenuClose();
    else setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position={'fixed'}
      className={cn(
        '!bg-background-default border-transparent-grey-16 !border-b !shadow-none',
        !isLocked && 'pl-16',
      )}
      style={drawerStyle}>
      <Toolbar className="mx-5 my-1 flex justify-between !p-0">
        <div className={`flex basis-3/10 flex-col text-2xl font-bold`}>
          <TextWrapper
            className="text-text-primary"
            content={headerInfo.title}
            variant={'H4Medium'}
          />
          {headerInfo.subTitle != '' && (
            <TextWrapper
              className="text-text-secondary"
              content={headerInfo.subTitle}
              variant={'Body2'}
            />
          )}
        </div>
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="flex items-center">
            <div className="flex min-w-[72px] items-center justify-between">
              <IconButton size={'small'} className="px-5">
                <IconSettingsHeader />
              </IconButton>
              <IconButton size={'small'} className="!ml-2 px-5">
                <IconNotificationHeader />
              </IconButton>
            </div>
            <div
              className="flex cursor-pointer items-center gap-1 px-3"
              onClick={toggleMenuOpen}>
              <Avatar className="!bg-transparent-interaction-16 !text-interaction-main font-size-[27.5px] !rounded-[2.5px] text-sm font-semibold">
                PK
              </Avatar>
              <div className="flex flex-col px-3">
                <TextWrapper
                  className="text-text-primary"
                  content={'Peter Keller'}
                  variant={'Body2'}
                />
                <TextWrapper
                  className="text-text-disabled"
                  content={'peterkeller@helsana.com'}
                  variant={'Caption'}
                />
              </div>
            </div>
          </div>
        </div>
      </Toolbar>
      <ProfileMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      />
    </AppBar>
  );
}
