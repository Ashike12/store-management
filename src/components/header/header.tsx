import {
  AppBar as MuiAppBar,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TextWrapper from '@components/text/TextWrapper';
import useGetHeaderTitle from '@core/hooks/useGetHeaderTitle';
import BusinessLogo from '@assets/images/logo-business.png';
import cn from '@core/utils/cn';
import { CustomButton } from '@components/button/CustomButton';
import { useAppDispatch } from '@core/store/hooks';
import { removeLogin } from '@core/store/slices/auth.slice';
import { IconChevronLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {AppThemeMode, useAppThemeMode} from 'theme/theme-provider';

interface AppBarProps {
  open?: boolean;
}

interface IHeaderProps {
  isLocked: boolean;
}

const AppBar = styled(MuiAppBar)<AppBarProps>(({ theme }) => ({
  // zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Header({ isLocked }: Readonly<IHeaderProps>) {
  const headerInfo = useGetHeaderTitle();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {mode, setMode} = useAppThemeMode();
  const handleLogout = () => {
    dispatch(removeLogin());
  };
  return (
    <AppBar
      position={'sticky'}
      className={cn('!border-b !shadow-none', !isLocked ? 'md:pl-[60px]' : '')}
      sx={theme => ({
        backgroundColor: theme.vars.palette.background.paper,
        borderColor: theme.vars.palette.divider,
      })}>
      <Toolbar className="mx-5 flex min-h-[80px] flex-wrap items-center justify-between gap-3 !p-0">
        <div className="flex min-w-0 flex-1 items-center text-2xl font-bold">
          {isLocked && (<div className='border-r h-16 pt-4 border-transparent-grey-16 pr-8 mr-4'>
            <TextWrapper
              className="pr-1 text-[var(--palette-text-secondary)]"
              content={'PROJECT_TITLE'}
              variant={'H6'}
            />
          </div>)}
          {headerInfo.backButtonPath && (
            <div className='mt-2 mr-2'>
              <IconButton onClick={() => navigate(headerInfo.backButtonPath)}><IconChevronLeft className="h-8 w-8 text-[var(--palette-text-secondary)]" /></IconButton>
            </div>
          )}
          <div className='flex flex-col justify-center'>

            <TextWrapper className="text-[var(--palette-text-primary)]" content={headerInfo.title} variant={'H4Medium'} />
            {headerInfo.subTitle != '' && (
              <TextWrapper className="text-[var(--palette-text-secondary)]" content={headerInfo.subTitle} variant={'Body2'} />
            )}
          </div>
        </div>
        <div className='flex shrink-0 items-center justify-end gap-3'>
          <Select
            size="small"
            value={mode}
            onChange={event => setMode(event.target.value as AppThemeMode)}
            sx={theme => ({
              minWidth: 124,
              bgcolor: theme.vars.palette.background.neutral,
              color: theme.vars.palette.text.primary,
            })}>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="pro">Pro</MenuItem>
          </Select>
          <img width={50} src={BusinessLogo} alt="expanded logo" />
          <CustomButton onClick={() => handleLogout()} className='cursor-pointer' text={'LOGOUT'} variant={'primary'}></CustomButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
