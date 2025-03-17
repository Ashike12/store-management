import * as React from 'react';
import LeftSidebar from '@components/left-sidebar/LeftSidebar.tsx';
import {Header} from '@components/header';
import RightSidebar from '@components/right-sidebar/RightSidebar';
import cn from '@core/utils/cn';
import useInitialAuthenticatedFetch from '@core/hooks/useInitialAuthenticatedFetch';

interface IBaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({children}: Readonly<IBaseLayoutProps>) {
  useInitialAuthenticatedFetch();
  // const translatedValue = useAppSelector(state => {
  //   return selectTranslation(state, 'global.versicherer.829');
  // });
  // console.log('translatedValue -> ', translatedValue);
  const [open, setOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] =
    React.useState<boolean>(true);
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
    <div className="flex">
      <LeftSidebar
        drawerClose={handleDrawerClose}
        drawerOpen={handleDrawerOpen}
        lockLeftSidebar={lockLeftSidebar}
        open={open}
        isLocked={isLocked}
      />
      <div className="bg-common-white flex flex-1 flex-col">
        <div className="ml-200">
          <Header isLocked={isLocked} open={open} />
        </div>
        <main
          className={cn(
            'mt-[72px] flex min-h-[calc(100vh-64px)] flex-1 p-5 transition-all duration-200 ease-in-out',
            isRightSidebarOpen ? 'mr-[344px]' : 'mr-[64px]',
            !isLocked && 'ml-16',
          )}>
          {children}
        </main>
        <RightSidebar
          isRightSidebarOpen={isRightSidebarOpen}
          setIsRightSidebarOpen={setIsRightSidebarOpen}
        />
      </div>
    </div>
  );
}
