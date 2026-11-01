import * as React from 'react';
import {Box} from '@mui/material';
import LeftSidebar from '@components/left-sidebar/LeftSidebar.tsx';
import {Header} from '@components/header';
import MobileNavigation from '@components/mobile-navigation/MobileNavigation';

interface IBaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({children}: Readonly<IBaseLayoutProps>) {
  const [open, setOpen] = React.useState(true);
  const [isLocked, setIsLocked] = React.useState(true);

  const lockLeftSidebar = () => {
    setIsLocked(true);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setIsLocked(false);
  };

  return (
    <Box
      className="flex min-h-screen"
      sx={theme => ({
        backgroundColor: theme.vars.palette.background.default,
      })}>
      <LeftSidebar
        drawerClose={handleDrawerClose}
        drawerOpen={handleDrawerOpen}
        lockLeftSidebar={lockLeftSidebar}
        open={open}
        isLocked={isLocked}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header isLocked={isLocked} />
        <Box
          component="main"
          className="flex min-w-0 flex-1 overflow-x-hidden transition-all duration-200 ease-in-out"
          sx={theme => ({
            minHeight: 'calc(100dvh - 64px)',
            padding: '12px 12px calc(86px + env(safe-area-inset-bottom))',
            marginLeft: 0,
            [theme.breakpoints.up('sm')]: {
              paddingTop: '16px',
              paddingRight: '16px',
              paddingLeft: '16px',
            },
            [theme.breakpoints.up('md')]: {
              minHeight: 'calc(100vh - 80px)',
              padding: '16px',
              paddingLeft: '20px',
              marginLeft: !isLocked ? '60px' : 0,
            },
          })}>
          {children}
        </Box>
        <MobileNavigation />
      </div>
    </Box>
  );
}
