import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  IconBox,
  IconBriefcase,
  IconBuildingStore,
  IconChartBar,
  IconFileInvoice,
  IconLayoutDashboard,
  IconMenu2,
  IconPackage,
  IconUserCog,
  IconX,
} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAppSelector} from '@core/store/hooks';
import {
  selectCurrentUserRoles,
  selectIsEmployee,
  selectIsWholeSaler,
} from '@core/store/slices/auth.slice';
import {canAccessOrderFulfillment} from '@features/orders/orderFulfillment';
import LanguageSwitcher from '@components/header/LanguageSwitcher';
import {AppThemeMode, useAppThemeMode} from 'theme/theme-provider';
import {useTranslation} from 'react-i18next';
import OrderFollowUp from '@components/header/OrderFollowUp';

const navigationItems = [
  {
    type: 'dashboard',
    labelKey: 'DASHBOARD',
    path: '/dashboard',
    Icon: IconLayoutDashboard,
  },
  {type: 'products', labelKey: 'PRODUCTS', path: '/products', Icon: IconBox},
  {
    type: 'wholesalers',
    labelKey: 'WHOLESALERS',
    path: '/wholesalers',
    Icon: IconBuildingStore,
  },
  {
    type: 'invoice',
    labelKey: 'INVOICE',
    path: '/invoice',
    Icon: IconFileInvoice,
  },
  {
    type: 'sales-history',
    labelKey: 'SALES_HISTORY',
    path: '/sales-history',
    Icon: IconChartBar,
  },
  {type: 'orders', labelKey: 'ORDERS', path: '/orders', Icon: IconPackage},
  {
    type: 'employees',
    labelKey: 'EMPLOYEES',
    path: '/employees',
    Icon: IconUserCog,
  },
  {
    type: 'employee-portal',
    labelKey: 'MY_WORK',
    path: '/employee-portal',
    Icon: IconBriefcase,
  },
];

const isItemActive = (pathname: string, type: string) => {
  const firstSegment = pathname.toLowerCase().split('/')[1] ?? '';
  if (type === 'dashboard')
    return firstSegment === '' || firstSegment === 'dashboard';
  if (type === 'invoice') return firstSegment === 'invoice';
  if (type === 'wholesalers')
    return firstSegment === 'wholesalers' || firstSegment === 'wholesaler';
  return firstSegment === type;
};

export default function MobileNavigation() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const {mode, setMode} = useAppThemeMode();
  const isWholesaler = useAppSelector(selectIsWholeSaler);
  const isEmployee = useAppSelector(selectIsEmployee);
  const isAdmin = useAppSelector(state =>
    selectCurrentUserRoles(state).includes('admin'),
  );
  const canAccessOrders = useAppSelector(state =>
    canAccessOrderFulfillment(selectCurrentUserRoles(state)),
  );

  const visibleItems = useMemo(() => {
    if (isEmployee)
      return navigationItems.filter(item => item.type === 'employee-portal');
    if (isWholesaler) {
      return navigationItems.filter(item =>
        ['dashboard', 'invoice'].includes(item.type),
      );
    }
    return navigationItems.filter(
      item =>
        item.type !== 'employee-portal' &&
        (item.type !== 'orders' || canAccessOrders),
    );
  }, [canAccessOrders, isEmployee, isWholesaler]);

  const primaryItems = visibleItems.slice(0, 4);
  const activeItem = visibleItems.find(item =>
    isItemActive(location.pathname, item.type),
  );
  const activeValue = primaryItems.some(item => item.type === activeItem?.type)
    ? activeItem?.type
    : 'more';

  const goTo = (path: string) => {
    navigate(path);
    setMoreOpen(false);
  };

  return (
    <>
      <Box
        component="nav"
        aria-label={t('PRIMARY_NAVIGATION')}
        sx={theme => ({
          display: {xs: 'block', md: 'none'},
          position: 'fixed',
          left: '12px',
          right: '12px',
          bottom: 'max(10px, env(safe-area-inset-bottom))',
          zIndex: theme.zIndex.appBar + 2,
          border: '1px solid',
          borderColor: theme.vars.palette.divider,
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: theme.shadows[12],
          backgroundColor: theme.vars.palette.background.paper,
        })}>
        <BottomNavigation
          showLabels
          value={activeValue}
          sx={theme => ({
            height: '64px',
            backgroundColor: theme.vars.palette.background.paper,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              minHeight: '56px',
              color: theme.vars.palette.text.secondary,
              padding: '7px 4px 5px',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '10px',
              lineHeight: 1.2,
              marginTop: '3px',
            },
            '& .Mui-selected': {color: theme.vars.palette.primary.main},
            '& .Mui-selected .MuiBottomNavigationAction-label': {
              fontSize: '10px',
              fontWeight: 700,
            },
          })}>
          {primaryItems.map(item => (
            <BottomNavigationAction
              key={item.type}
              value={item.type}
              label={t(item.labelKey)}
              icon={
                <item.Icon
                  size={22}
                  stroke={activeItem?.type === item.type ? 2.5 : 1.8}
                />
              }
              onClick={() => goTo(item.path)}
            />
          ))}
          <BottomNavigationAction
            value="more"
            label={t('MORE')}
            icon={<IconMenu2 size={22} />}
            onClick={() => setMoreOpen(true)}
          />
        </BottomNavigation>
      </Box>

      <Drawer
        anchor="bottom"
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        PaperProps={{
          sx: theme => ({
            display: {md: 'none'},
            maxHeight: '78dvh',
            borderRadius: '22px 22px 0 0',
            backgroundColor: theme.vars.palette.background.paper,
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          }),
        }}>
        <Box sx={{padding: '14px 16px 8px'}}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('MORE')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('ALL_DESTINATIONS')}
              </Typography>
            </Box>
            <IconButton
              aria-label={t('CLOSE_NAVIGATION')}
              onClick={() => setMoreOpen(false)}
              sx={{width: '44px', height: '44px'}}>
              <IconX size={22} />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <List sx={{padding: '10px 12px', overflowY: 'auto'}}>
          {visibleItems.map(item => {
            const selected = isItemActive(location.pathname, item.type);
            return (
              <ListItemButton
                key={item.type}
                selected={selected}
                onClick={() => goTo(item.path)}
                sx={{
                  minHeight: '52px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  padding: '10px 12px',
                  '&.Mui-selected': {fontWeight: 700},
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: '40px',
                    color: selected ? 'primary.main' : 'text.secondary',
                  }}>
                  <item.Icon size={22} />
                </ListItemIcon>
                <ListItemText primary={t(item.labelKey)} />
              </ListItemButton>
            );
          })}
        </List>
        {isAdmin && (
          <>
            <Divider />
            <Box sx={{padding: '14px 16px 4px'}}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}>
                {t('IMMEDIATE_ACTIONS')}
              </Typography>
              <Box
                sx={{
                  marginTop: '8px',
                  '& .MuiButton-root': {minHeight: '44px', width: '100%'},
                }}>
                <OrderFollowUp />
              </Box>
            </Box>
          </>
        )}
        <Divider />
        <Box sx={{padding: '14px 16px 4px'}}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}>
            {t('PREFERENCES')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '8px',
            }}>
            <Box
              sx={{minHeight: '44px', display: 'flex', alignItems: 'center'}}>
              <LanguageSwitcher />
            </Box>
            <Select
              size="small"
              value={mode}
              onChange={event => setMode(event.target.value as AppThemeMode)}
              aria-label={t('THEME')}
              sx={{minHeight: '44px', backgroundColor: 'background.default'}}>
              <MenuItem value="light">{t('LIGHT_THEME')}</MenuItem>
              <MenuItem value="dark">{t('DARK_THEME')}</MenuItem>
              <MenuItem value="pro">{t('PRO_THEME')}</MenuItem>
            </Select>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
