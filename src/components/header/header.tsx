import {
  AppBar as MuiAppBar,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import TextWrapper from '@components/text/TextWrapper';
import useGetHeaderTitle from '@core/hooks/useGetHeaderTitle';
import cn from '@core/utils/cn';
import {useAppDispatch, useAppSelector} from '@core/store/hooks';
import {
  removeLogin,
  selectCurrentUserName,
} from '@core/store/slices/auth.slice';
import {IconChevronLeft} from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom';
import {AppThemeMode, useAppThemeMode} from 'theme/theme-provider';
import {MouseEvent, useMemo, useState} from 'react';
import {useGetCurrentUserQuery} from '@core/store/api';
import UserProfileDialog from './UserProfileDialog';
import OrderFollowUp from './OrderFollowUp';
import EmployeeNotifications from './EmployeeNotifications';
import LanguageSwitcher from './LanguageSwitcher';

interface AppBarProps {
  open?: boolean;
}

interface IHeaderProps {
  isLocked: boolean;
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({theme}) => ({
  // zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Header({isLocked}: Readonly<IHeaderProps>) {
  const headerInfo = useGetHeaderTitle();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {mode, setMode} = useAppThemeMode();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const tokenUserName = useAppSelector(selectCurrentUserName);
  const {data: currentUserData} = useGetCurrentUserQuery();
  const currentUserName =
    currentUserData?.Data?.DisplayName || tokenUserName || 'User';
  const initials = useMemo(
    () =>
      currentUserName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join('') || 'U',
    [currentUserName],
  );
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const handleLogout = () => {
    dispatch(removeLogin());
    navigate('/login');
  };
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleOpenProfile = () => {
    setIsProfileDialogOpen(true);
    handleMenuClose();
  };
  return (
    <AppBar
      position={'sticky'}
      className={cn('!border-b !shadow-none')}
      sx={theme => ({
        backgroundColor: theme.vars.palette.background.paper,
        borderColor: theme.vars.palette.divider,
        paddingLeft: {xs: 0, md: !isLocked ? '60px' : 0},
      })}>
      <Toolbar
        className="flex flex-nowrap items-center justify-between !p-0"
        sx={{
          minHeight: {xs: '64px', md: '80px'},
          marginX: {xs: '12px', sm: '16px', md: '20px'},
          gap: {xs: '8px', md: '12px'},
        }}>
        <div
          className={`flex min-w-0 flex-1 items-center font-bold ${desktop ? 'text-2xl' : ''}`}>
          {isLocked && (
            <Box
              sx={{display: {xs: 'none', md: 'block'}}}
              className="border-transparent-grey-16 mr-4 h-16 border-r pt-4 pr-8">
              <TextWrapper
                className="pr-1 text-[var(--palette-text-secondary)]"
                content={'PROJECT_TITLE'}
                variant={'H6'}
              />
            </Box>
          )}
          {headerInfo.backButtonPath && (
            <div className={desktop ? 'mt-2 mr-2' : 'mr-1'}>
              <IconButton
                aria-label="Go back"
                onClick={() => navigate(headerInfo.backButtonPath)}
                sx={{width: {xs: 44, md: 48}, height: {xs: 44, md: 48}}}>
                <IconChevronLeft
                  className={`${desktop ? 'h-8 w-8' : 'h-6 w-6'} text-[var(--palette-text-secondary)]`}
                />
              </IconButton>
            </div>
          )}
          <div className="flex min-w-0 flex-col justify-center">
            <TextWrapper
              className={`truncate text-[var(--palette-text-primary)] ${desktop ? '' : 'text-lg'}`}
              content={headerInfo.title}
              variant={'H4Medium'}
            />
            {headerInfo.subTitle != '' && (
              <TextWrapper
                className="hidden text-[var(--palette-text-secondary)] sm:block"
                content={headerInfo.subTitle}
                variant={'Body2'}
              />
            )}
          </div>
        </div>
        <div
          className={`flex shrink-0 flex-nowrap items-center justify-end ${desktop ? 'gap-3' : 'gap-1 sm:gap-2'}`}>
          {desktop && <OrderFollowUp />}
          <EmployeeNotifications />
          {desktop && <LanguageSwitcher />}
          <Select
            size="small"
            value={mode}
            onChange={event => setMode(event.target.value as AppThemeMode)}
            sx={theme => ({
              display: {xs: 'none', md: 'inline-flex'},
              minWidth: 124,
              bgcolor: theme.vars.palette.background.neutral,
              color: theme.vars.palette.text.primary,
            })}>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="pro">Pro</MenuItem>
          </Select>
          <button
            type="button"
            onClick={handleMenuOpen}
            className={`flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-full border transition-colors hover:bg-[var(--palette-background-neutral)] ${desktop ? 'px-3 py-2' : 'p-1'}`}
            style={{
              borderColor: 'var(--palette-divider)',
              color: 'var(--palette-text-primary)',
            }}>
            <Avatar
              sx={{
                width: {xs: 34, md: 36},
                height: {xs: 34, md: 36},
                bgcolor: 'var(--palette-primary-main)',
                fontSize: '14px',
              }}>
              {initials}
            </Avatar>
            {desktop && (
              <div className="text-left">
                <div className="text-sm font-semibold">{currentUserName}</div>
                <div className="text-xs text-[var(--palette-text-secondary)]">
                  Account
                </div>
              </div>
            )}
          </button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}>
            <MenuItem disabled>{currentUserName}</MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenProfile}>Profile Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          <UserProfileDialog
            open={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}
