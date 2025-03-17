import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import {styled, Theme, CSSObject} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import {DRAWER_WIDTH} from '@core/config/constants';
import {EnumLeftSidebarItem} from '@core/enums/left-sidebar-item.enum';
import IconCirclesFourFilled from '@assets/icons/IconCirclesFourFilled';
import IconCirclesFourOutline from '@assets/icons/IconCirclesFourOutline';
import IconKanbanOutline from '@assets/icons/IconKanbanOutline';
import IconKanbanFilled from '@assets/icons/IconKanbanFilled';
import AsensisLogo from '@assets/images/logo-asensis.png';
import {
  DrawerHeaderLogoSvg,
  SkywalkLogoExpandedSvg,
  SkywalkLogoSvg,
} from '@assets/svg';
import {useMatch, useNavigate} from 'react-router';
import TextWrapper from '@components/text/TextWrapper';
import IconArrowClockwise from '@assets/icons/IconArrowClockwise';
import PinPartnerList from '@components/pin-partner-list/PinPartnerList';
import cn from '@core/utils/cn';
import LeftSidebarHeader from './left-sidebar-header/LeftSidebarHeader';
import LeftSidebarFooter from './left-sidebar-footer/LeftSidebarFooter';
import {useAppDispatch, useAppSelector} from '@core/store/hooks';
import {
  removeAllPinnedPartners,
  selectIsAnyPartnerPinned,
} from '@core/store/slices/pinned-partner.slice';
import {ROUTE_PATH} from '@core/config/routePath';

const drawerWidth = DRAWER_WIDTH;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#f4f4f7',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#f4f4f7',
  width: `calc(${theme.spacing(9)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: prop => prop !== 'open'})(
  ({theme}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({open}) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({open}) => !open,
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
    type: EnumLeftSidebarItem.DASHBOARD,
    OutlineIcon: IconCirclesFourOutline,
    FilledIcon: IconCirclesFourFilled,
    text: ROUTE_PATH.dashBoard.title,
    path: ROUTE_PATH.dashBoard.path,
  },
  {
    type: EnumLeftSidebarItem.TASK,
    OutlineIcon: IconKanbanOutline,
    FilledIcon: IconKanbanFilled,
    text: ROUTE_PATH.task.title,
    path: ROUTE_PATH.task.path,
  },
];

export default function LeftSidebar({
  drawerClose,
  drawerOpen,
  lockLeftSidebar,
  open,
  isLocked,
}: Readonly<ISidebarProps>) {
  const dispatch = useAppDispatch();
  const isAnyPartnerPinned = useAppSelector(selectIsAnyPartnerPinned);
  const navigateTo = useNavigate();
  const match = useMatch(':pageName');
  const isActiveItem = (itemType: string) => {
    return match?.params.pageName === itemType.toLowerCase();
  };
  const drawerCollapse = () => {
    if (!isLocked) drawerClose();
  };

  const handleRemoveAllPinnedPartners = () => {
    dispatch(removeAllPinnedPartners());
    navigateTo('/dashboard');
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      anchor="left"
      sx={{
        height: '100vh', // Ensures the drawer takes up the full height
        overflowY: 'hidden', // Prevents vertical scrolling
        '& .MuiDrawer-paper': {
          height: '100vh', // Ensures the drawer's paper also takes full height
          overflowY: 'hidden', // Prevents internal scrolling
        },
      }}
      className={cn('', isLocked ? 'relative' : 'fixed z-[9999]')}>
      <div
        className={cn('flex h-full flex-col pt-5', open ? 'px-4' : 'px-2')}
        onPointerLeave={drawerCollapse}>
        <div
          className="bg-grey-grey-50 sticky top-0"
          onPointerEnter={drawerOpen}>
          <LeftSidebarHeader
            open={open}
            expandedLogo={DrawerHeaderLogoSvg}
            isLocked={isLocked}
            lockLeftSidebar={lockLeftSidebar}
            logo={AsensisLogo}
          />
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
                sx={{display: 'block'}}
                onClick={() => navigateTo(item.path)}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: '44px',
                      maxHeight: '44px',
                      width: '100%',
                      px: '16px',
                      py: '10px',
                      borderRadius: '4px',
                      backgroundColor: isActiveItem(item.type)
                        ? 'rgba(145, 158, 171, 0.24)'
                        : 'transparent',
                    },
                    {
                      '&:hover': {
                        backgroundColor: isActiveItem(item.type)
                          ? 'rgba(145, 158, 171, 0.24)'
                          : 'rgba(145, 158, 171, 0.08)',
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
                    {isActiveItem(item.type)
                      ? item.FilledIcon({color: '#212B36', size: 20})
                      : item.OutlineIcon({color: '#212B36', size: 20})}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <TextWrapper
                        className="text-text-primary"
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
          {open && isAnyPartnerPinned && (
            <div className="mb-2 flex w-full flex-col">
              <div className="flex flex-row items-center gap-3">
                <TextWrapper
                  content={'CONTACT'}
                  className="text-text-disabled text-[10px] leading-[18px] font-[700] uppercase"
                />
                <div className="w-full border-t border-[#CCD2D8]"></div>
              </div>
              <div className="flex flex-row items-center justify-end py-[2px]">
                <button
                  className="flex cursor-pointer items-center gap-2"
                  onClick={handleRemoveAllPinnedPartners}>
                  <IconArrowClockwise />
                  <TextWrapper
                    content={'CLEAR_ALL'}
                    variant={'ButtonSmall'}
                    className="text-text-secondary"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="scrollbar-hide flex-1 overflow-y-scroll"
          onPointerEnter={drawerOpen}>
          {<PinPartnerList open={open} />}
        </div>
        <div className="sticky bottom-0 flex flex-row items-center justify-between bg-[#f4f4f7] pt-2 pb-5">
          <LeftSidebarFooter
            open={open}
            SkywalkLogoExpanded={SkywalkLogoExpandedSvg}
            SkywalkLogo={SkywalkLogoSvg}
            drawerOpen={drawerOpen}
            drawerClose={drawerClose}
          />
        </div>
      </div>
    </Drawer>
  );
}
