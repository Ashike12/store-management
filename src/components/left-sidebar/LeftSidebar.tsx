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
import { useMatch, useNavigate } from 'react-router-dom';
import IconCaretDoubleLeft from '@assets/icons/IconCaretDoubleLeft';
import TextWrapper from '@components/text/TextWrapper';
import { IconBox, IconBuildingStore, IconFileInvoice, IconLayoutDashboard } from '@tabler/icons-react';
import IconCaretDoubleRight from '@assets/icons/IconCaretDoubleRight';
import cn from '@core/utils/cn';

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
  const navigateTo = useNavigate();
  const match = useMatch(':pageName');
  const isActiveItem = (itemType: string) => {
    return match?.params.pageName === itemType.toLowerCase();
  };
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
                <TextWrapper
                  className="pr-1 text-[var(--palette-common-white)]"
                  content={'PROJECT_TITLE'}
                  variant={'H6'}
                />
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
                <ListItemButton
                  sx={theme => [
                    {
                      minHeight: '44px',
                      maxHeight: '44px',
                      width: '100%',
                      px: '16px',
                      py: '10px',
                      borderRadius: '4px',
                      color: theme.vars.palette.common.white,
                      backgroundColor: isActiveItem(item.type)
                        ? theme.vars.palette.secondary.dark
                        : 'transparent',
                    },
                    {
                      '&:hover': {
                        backgroundColor: theme.vars.palette.secondary.dark,
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
                    {isActiveItem(item.type) ? (
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
              </ListItem>
            ))}
          </List>
        </div>
        <div className="flex flex-row items-center justify-between pt-2 pb-5">
          {open ? (
            <>
              <div className="flex flex-row items-center justify-start">
                <TextWrapper
                  className="pr-1 text-[var(--palette-common-white)]"
                  content={'Ashikur Rahman Nabir'}
                  variant={'Caption'}
                />
              </div>
              <div className="pl-2">
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                  style={{backgroundColor: 'var(--palette-background-neutral)'}}
                  onClick={drawerClose}>
                  <IconCaretDoubleLeft />
                </button>
              </div>
            </>
          ) : (
            <div className="flex w-full flex-row items-center justify-center">
              <button
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
                style={{backgroundColor: 'var(--palette-background-neutral)'}}
                onClick={() => {
                  drawerOpen();
                  lockLeftSidebar();
                }}>
                <IconCaretDoubleRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
