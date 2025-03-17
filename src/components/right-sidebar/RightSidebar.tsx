import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import cn from '@core/utils/cn';
import {EnumRightSidebarMenuItem} from '@core/enums/right-sidebar-item.enum';
import IconCaretDoubleRight from '@assets/icons/IconCaretDoubleRight';
import IconCaretDoubleLeft from '@assets/icons/IconCaretDoubleLeft';
import {Drawer} from '@mui/material';
import useMenuItems from '@core/hooks/useMenuItems';

interface IRightSidebarProps {
  isRightSidebarOpen: boolean;
  setIsRightSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function RightSidebar({
  isRightSidebarOpen,
  setIsRightSidebarOpen,
}: Readonly<IRightSidebarProps>) {
  const [openDrawer, setOpenDrawer] = useState<EnumRightSidebarMenuItem>(
    EnumRightSidebarMenuItem.NOTES,
  );

  const menuInfo = useMenuItems();

  const handleOpen = (drawerType: EnumRightSidebarMenuItem) => {
    setOpenDrawer(drawerType);
    setIsRightSidebarOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsRightSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    setOpenDrawer(EnumRightSidebarMenuItem.NOTES);
  }, [menuInfo.moduleItemSelectName]);

  return (
    <div className="fixed top-[64px] right-0 flex h-full items-start justify-start">
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            height: '100vh',
            position: 'relative',
            backgroundColor: '#FFF',
            padding: '16px',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: '#919EAB3D',
          },
        }}
        variant={'persistent'}
        anchor="right"
        open={isRightSidebarOpen}>
        {menuInfo.menuItems.map(({DrawerComponent, Type}) => (
          <DrawerComponent key={Type} isDrawerOpen={openDrawer === Type} />
        ))}
      </Drawer>
      <div className="bg-grey-grey-50 border-l-transparent-grey-16 z-[9999] flex h-[calc(100vh-64px)] min-w-[64px] flex-col items-center justify-between gap-2 border-l pt-5">
        <div className="flex flex-col items-center gap-2">
          {menuInfo.menuItems.map(({Type, OutlineIcon, FilledIcon}) => (
            <button
              key={Type}
              className={cn(
                'flex h-[44px] cursor-pointer items-center px-4 py-[10px]',
                openDrawer === Type &&
                  'border-r-interaction-secondary border-r-[2px]',
              )}
              onClick={() => handleOpen(Type)}>
              {openDrawer === Type ? (
                <FilledIcon color="#333333" size={24} />
              ) : (
                <OutlineIcon color="#50575E" size={24} />
              )}
            </button>
          ))}
        </div>
        <button
          className="bg-transparent-grey-16 mb-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          onClick={handleCloseDrawer}>
          {isRightSidebarOpen ? (
            <IconCaretDoubleRight />
          ) : (
            <IconCaretDoubleLeft />
          )}
        </button>
      </div>
    </div>
  );
}
