import * as React from 'react';
import LeftSidebar from '@components/left-sidebar/LeftSidebar.tsx';
import {Header} from '@components/header';
import cn from '@core/utils/cn';

interface IBaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({children}: Readonly<IBaseLayoutProps>) {
  const [open, setOpen] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);

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
    <div className="flex min-h-screen bg-common-white">
      <LeftSidebar
        drawerClose={handleDrawerClose}
        drawerOpen={handleDrawerOpen}
        lockLeftSidebar={lockLeftSidebar}
        open={open}
        isLocked={isLocked}
      />
      <div className="bg-common-white flex min-w-0 flex-1 flex-col">
        <Header isLocked={isLocked} />
        <main
          className={cn(
            'flex min-h-[calc(100vh-80px)] min-w-0 flex-1 p-4 pl-5 transition-all duration-200 ease-in-out',
            !isLocked ? 'md:ml-[60px]' : '',
          )}>
          {children}
        </main>
      </div>
    </div>
  );
}
