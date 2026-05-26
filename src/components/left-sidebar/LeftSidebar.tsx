import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { DRAWER_WIDTH } from '@core/config/constants';
import BusinessLogo from '@assets/images/logo-business.png';
import BASE_ROUTES from '@core/config/base-routes';
import { useLocation, useNavigate } from 'react-router-dom';
import IconCaretDoubleLeft from '@assets/icons/IconCaretDoubleLeft';
import TextWrapper from '@components/text/TextWrapper';
import { IconBox, IconBuildingStore, IconFileInvoice, IconLayoutDashboard } from '@tabler/icons-react';
import IconCaretDoubleRight from '@assets/icons/IconCaretDoubleRight';
import cn from '@core/utils/cn';
import {useAppThemeMode} from 'theme/theme-provider';

const drawerWidth = DRAWER_WIDTH;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.vars.palette.secondary.main,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.vars.palette.secondary.main,
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

interface ISidebarProps {
  drawerClose: () => void;
  drawerOpen: () => void;
  lockLeftSidebar: () => void;
  open: boolean;
  isLocked: boolean;
}

const menuItems = [
  {
    type: BASE_ROUTES[0].pathMatch,
    OutlineIcon: IconLayoutDashboard,
    FilledIcon: IconLayoutDashboard,
    text: BASE_ROUTES[0].title,
    path: BASE_ROUTES[0].path,
  },
  {
    type: BASE_ROUTES[1].pathMatch,
    OutlineIcon: IconBox,
    FilledIcon: IconBox,
    text: BASE_ROUTES[1].title,
    path: BASE_ROUTES[1].path,
  },
  {
    type: BASE_ROUTES[2].pathMatch,
    OutlineIcon: IconBuildingStore,
    FilledIcon: IconBuildingStore,
    text: BASE_ROUTES[2].title,
    path: BASE_ROUTES[2].path,
  },
  {
    type: BASE_ROUTES[3].pathMatch,
    OutlineIcon: IconFileInvoice,
    FilledIcon: IconFileInvoice,
    text: BASE_ROUTES[3].title,
    path: BASE_ROUTES[3].path,
  },
];

export default function LeftSidebar({
  drawerClose,
  drawerOpen,
  lockLeftSidebar,
  open = false,
  isLocked = true,
}: Readonly<ISidebarProps>) {
  const {mode} = useAppThemeMode();
  const navigateTo = useNavigate();
  const location = useLocation();
  const isActiveItem = (itemType: string) => {
    const pathParts = location.pathname.toLowerCase().split('/');
    const firstSegment = pathParts[1] ?? '';
    const secondSegment = pathParts[2] ?? '';
    const normalizedType = itemType.toLowerCase();

    const pathCheck =
      firstSegment === 'invoice' && secondSegment
        ? `${firstSegment}/${secondSegment}`
        : firstSegment === 'wholesaler' && secondSegment
          ? `${firstSegment}/${secondSegment}`
          : firstSegment;

    if (normalizedType === 'dashboard') {
      return pathCheck === 'dashboard' || pathCheck === '';
    }

    if (normalizedType === 'products') {
      return pathCheck === 'products';
    }

    if (normalizedType === 'wholesalers') {
      return pathCheck === 'wholesalers' || pathCheck === 'wholesaler/invoice';
    }

    if (normalizedType === 'invoice') {
      return firstSegment === 'invoice';
    }

    return false;
  };

  const menuTextColor = mode === 'dark' ? '#94A3B8' : mode === 'pro' ? '#C6D4E1' : '#CBD5E1';
  const menuActiveBg = mode === 'dark' ? '#1E293B' : mode === 'pro' ? '#1F3B57' : '#334155';
  const menuHoverBg = mode === 'dark' ? '#334155' : mode === 'pro' ? '#1F3B57' : '#1E293B';
  const sidebarMetaText = mode === 'dark' ? '#94A3B8' : mode === 'pro' ? '#C6D4E1' : '#CBD5E1';

  return (
    <Drawer
      variant="permanent"
      open={open}
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          height: '100vh', // Full screen height
          borderRight: '1px solid',
          borderColor: 'var(--palette-secondary-dark)',
        },
        display: { xs: 'none', md: 'block' },
      }}
      className={cn(
        isLocked ? 'relative' : 'fixed inset-0 z-[9999]',
      )}>
      <div
        className={`flex flex-col min-h-screen justify-between pt-5 ${open ? 'px-4' : 'px-2'}`}
      >
        <div className="">
          <div className="flex items-center justify-center">
            {open ? (
              <div className="flex w-full items-center justify-between pb-6">
                <div style={{color: sidebarMetaText}}>
                  <TextWrapper
                    className="pr-1"
                    content={'PROJECT_TITLE'}
                    variant={'H6'}
                  />
                </div>
                {/* {!isLocked && (
                  <button
                    className="bg-transparent-grey-16 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-[10px]"
                    onClick={lockLeftSidebar}>
                    <IconLock />
                  </button>
                )} */}
              </div>
            ) : (
              <div className="pb-4">
                <img src={BusinessLogo} alt="logo" />
              </div>
            )}
          </div>
          <List
            sx={{
              px: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '8px',
            }}>
            {menuItems.map(item => (
              <ListItem
                key={item.path}
                disablePadding
                sx={{ display: 'block' }}
                onClick={() => navigateTo(item.path)}>
                {(() => {
                  const isActive = isActiveItem(item.type);
                  return (
                <ListItemButton
                  selected={isActive}
                  sx={[
                    {
                      minHeight: '44px',
                      maxHeight: '44px',
                      width: '100%',
                      px: '16px',
                      py: '10px',
                      borderRadius: '6px',
                      color: menuTextColor,
                      backgroundColor: 'transparent',
                      borderLeft: '3px solid transparent',
                      fontWeight: 500,
                    },
                    {
                      '&:hover': {
                        color: 'var(--palette-common-white)',
                        backgroundColor: menuHoverBg,
                        borderLeft: '3px solid var(--palette-primary-main)',
                      },
                      '&.Mui-selected': {
                        color: 'var(--palette-common-white)',
                        backgroundColor: menuActiveBg,
                        borderLeft: '3px solid var(--palette-primary-main)',
                        fontWeight: 700,
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: menuActiveBg,
                      },
                    },
                    open
                      ? {
                          justifyContent: 'initial',
                        }
                      : {
                          justifyContent: 'center',
                        },
                    ]}>
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: 'center',
                      },
                      open
                        ? {
                          mr: '8px',
                        }
                      : {
                          mr: 0,
                      },
                    ]}>
                    {isActive ? (
                      <item.FilledIcon color="currentColor" size={20} />
                    ) : (
                      <item.OutlineIcon color="currentColor" size={20} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <TextWrapper
                        className=""
                        content={item.text}
                        variant={'Body2'}
                      />
                    }
                    sx={[
                      open
                        ? {
                          opacity: 1,
                        }
                        : {
                          opacity: 0,
                        },
                    ]}
                  />
                </ListItemButton>
                  );
                })()}
              </ListItem>
            ))}
          </List>
        </div>
        <div className="flex flex-row items-center justify-between pt-2 pb-5">
          {open ? (
            <>
              <div className="flex flex-row items-center justify-start">
                <div style={{color: sidebarMetaText}}>
                  <TextWrapper
                    className="pr-1"
                    content={'Ashikur Rahman Nabir'}
                    variant={'Caption'}
                  />
                </div>
              </div>
              <div className="pl-2">
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'var(--palette-background-neutral)',
                    color: 'var(--palette-text-primary)',
                    border: '1px solid var(--palette-divider)',
                  }}
                  onClick={drawerClose}>
                  <IconCaretDoubleLeft color="currentColor" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex w-full flex-row items-center justify-center">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--palette-background-neutral)',
                  color: 'var(--palette-text-primary)',
                  border: '1px solid var(--palette-divider)',
                }}
                onClick={() => {
                  drawerOpen();
                  lockLeftSidebar();
                }}>
                <IconCaretDoubleRight color="currentColor" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
