import {
  IconButton,
  AppBar as MuiAppBar,
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
  const handleLogout = () => {
    dispatch(removeLogin());
  };
  return (
    <AppBar
      position={'sticky'}
      className={cn(
        '!bg-background-default border-transparent-grey-16 !border-b !shadow-none',
        !isLocked ? 'pl-16' : '',
      )}>
      <Toolbar className="mx-5 flex justify-between !p-0">
        <div className={`flex basis-7/10 text-2xl font-bold`}>
          {isLocked && (<div className='border-r h-16 pt-4 border-transparent-grey-16 pr-8 mr-4'>
            <TextWrapper
              className="text-text-disabled pr-1"
              content={'PROJECT_TITLE'}
              variant={'H6'}
            />
          </div>)}
          {headerInfo.backButtonPath && (
            <div className='mt-2 mr-2'>
              <IconButton onClick={() => navigate(headerInfo.backButtonPath)}><IconChevronLeft className="h-8 w-8 text-gray-400" /></IconButton>
            </div>
          )}
          <div className='flex flex-col justify-center'>

            <TextWrapper content={headerInfo.title} variant={'H4Medium'} />
            {headerInfo.subTitle != '' && (
              <TextWrapper content={headerInfo.subTitle} variant={'Body2'} />
            )}
          </div>
        </div>
        <div className='flex justify-end basis-3/10'>
          <img width={50} src={BusinessLogo} alt="expanded logo" />
          <CustomButton onClick={() => handleLogout()} className='ml-4 mt-2 cursor-pointer' text={'LOGOUT'} variant={'primary'}></CustomButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
