import {Badge, Box, Button, Divider, IconButton, Menu, Stack, Typography} from '@mui/material';
import {IconBell} from '@tabler/icons-react';
import {MouseEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAppSelector} from '@core/store/hooks';
import {selectCurrentUserRoles} from '@core/store/slices/auth.slice';
import {useListEmployeeNotificationsQuery, useMarkEmployeeNotificationReadMutation} from '@core/store/api/employeeApi';

function AdminEmployeeNotifications() {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const notifications = useListEmployeeNotificationsQuery(
    {Status: 'unread', Page: 1, Size: 10},
    {pollingInterval: 30000},
  );
  const [markRead] = useMarkEmployeeNotificationReadMutation();
  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const openEmployee = async (FeedbackId: string, EmployeeId: string) => {
    await markRead({FeedbackId}).unwrap();
    setAnchor(null);
    navigate(`/employees?employee=${encodeURIComponent(EmployeeId)}`);
  };

  return <>
    <IconButton aria-label={`${notifications.data?.TotalCount ?? 0} unread employee review requests`} onClick={openMenu}>
      <Badge badgeContent={notifications.data?.TotalCount ?? 0} color="error"><IconBell /></Badge>
    </IconButton>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right'}}>
      <Box sx={{width: 340, maxWidth: '90vw', px: 2, py: 1}}>
        <Typography fontWeight={800}>Employee review requests</Typography>
        <Typography variant="caption" color="text.secondary">Unread feedback that needs an admin decision</Typography>
      </Box>
      <Divider />
      {notifications.data?.Data.length === 0 && <Typography color="text.secondary" p={2}>No unread requests.</Typography>}
      <Stack divider={<Divider flexItem />}>
        {notifications.data?.Data.map(item => <Button key={item.ItemId} onClick={() => openEmployee(item.ItemId, item.EmployeeId)} sx={{display: 'block', textAlign: 'left', textTransform: 'none', px: 2, py: 1.5}}>
          <Typography fontWeight={700}>{item.EmployeeName || 'Employee'}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{item.Explanation}</Typography>
        </Button>)}
      </Stack>
      <Divider />
      <Button fullWidth onClick={() => {setAnchor(null); navigate('/employees');}}>Open employee management</Button>
    </Menu>
  </>;
}

export default function EmployeeNotifications() {
  const isAdmin = useAppSelector(state => selectCurrentUserRoles(state).includes('admin'));
  return isAdmin ? <AdminEmployeeNotifications /> : null;
}
