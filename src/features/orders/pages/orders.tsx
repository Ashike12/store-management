import {useEffect, useMemo, useRef, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  IconArrowRight,
  IconCalendar,
  IconPackage,
  IconPhone,
  IconRefresh,
  IconSearch,
  IconTruckDelivery,
  IconX,
} from '@tabler/icons-react';
import {useAppSelector} from '@core/store/hooks';
import {selectCurrentUserRoles} from '@core/store/slices/auth.slice';
import {
  FollowUpOrder,
  ORDER_STATUSES,
  OrderUpdateChannel,
  OrderStatus,
  useGetFollowUpOrderQuery,
  useListOrdersQuery,
  useTransitionOrderMutation,
  useUpdateOrderInfoMutation,
} from '@core/store/api/ordersApi';
import {
  buildOrdersRequest,
  canAccessOrderFulfillment,
  getValidOrderTransitions,
  isConflictError,
  OrderStatusFilter,
} from '../orderFulfillment';

const statusColors: Record<
  OrderStatus,
  'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'error'
> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'primary',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'error',
};

const actionLabels: Record<Exclude<OrderStatus, 'pending'>, string> = {
  confirmed: 'Confirm order',
  processing: 'Start processing',
  shipped: 'Mark as shipped',
  delivered: 'Mark as delivered',
  cancelled: 'Cancel order',
};

const updateChannels: {value: OrderUpdateChannel; label: string}[] = [
  {value: 'PhoneCall', label: 'Phone call'},
  {value: 'Messaging', label: 'Messaging'},
  {value: 'Email', label: 'Email'},
];

interface OrderInfoDraft {
  CustomerName: string;
  PhoneNumber: string;
  Division: string;
  District: string;
  Area: string;
  PostCode: string;
  Address: string;
  DeliveryNotes: string;
  DeliveryZone: 'inside_dhaka' | 'outside_dhaka';
}

const orderInfoDraft = (order: FollowUpOrder): OrderInfoDraft => ({
  CustomerName: order.CustomerName ?? '',
  PhoneNumber: order.PhoneNumber ?? '',
  Division: order.Division ?? '',
  District: order.District ?? '',
  Area: order.Area ?? '',
  PostCode: order.PostCode ?? '',
  Address: order.Address ?? '',
  DeliveryNotes: order.DeliveryNotes ?? '',
  DeliveryZone:
    order.DeliveryZone === 'outside_dhaka' ? 'outside_dhaka' : 'inside_dhaka',
});

const money = (value = 0) =>
  new Intl.NumberFormat('en-BD', {style: 'currency', currency: 'BDT'}).format(
    value,
  );

const dateTime = (value?: string) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

function StatusChip({status}: {status: OrderStatus}) {
  return (
    <Chip
      size="small"
      color={statusColors[status]}
      variant={status === 'pending' ? 'filled' : 'outlined'}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      sx={{fontWeight: 700}}
    />
  );
}

function OrderRecord({
  order,
  onOpen,
}: {
  order: FollowUpOrder;
  onOpen: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{p: 2}}>
      <Stack spacing={1.25}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}>
          <Box>
            <Typography fontWeight={800}>{order.OrderNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              {dateTime(order.CreatedDate ?? order.createdAt)}
            </Typography>
          </Box>
          <StatusChip status={order.OrderStatus} />
        </Stack>
        <Box>
          <Typography fontWeight={700}>{order.CustomerName}</Typography>
          <Link
            href={`tel:${order.PhoneNumber.replace(/[^+\d]/g, '')}`}
            underline="hover">
            {order.PhoneNumber}
          </Link>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
            <Typography fontWeight={800}>{money(order.TotalAmount)}</Typography>
          </Box>
          <Chip size="small" label={`${order.PaymentStatus} / manual`} />
        </Stack>
        <Button
          variant="outlined"
          endIcon={<IconArrowRight size={17} />}
          onClick={onOpen}>
          Review order
        </Button>
      </Stack>
    </Paper>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{
        p: {xs: '16px', sm: '20px'},
        borderRadius: '12px',
        minWidth: 0,
      }}>
      <Typography
        component="h3"
        variant="overline"
        color="text.secondary"
        fontWeight={800}
        sx={{display: 'block', letterSpacing: '0.08em'}}>
        {title}
      </Typography>
      <Box sx={{mt: '12px', minWidth: 0}}>{children}</Box>
    </Paper>
  );
}

export function OrderDetailsDrawer({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [mustReload, setMustReload] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoDraft, setInfoDraft] = useState<OrderInfoDraft | null>(null);
  const [updateDoneBy, setUpdateDoneBy] =
    useState<OrderUpdateChannel>('PhoneCall');
  const [updateNote, setUpdateNote] = useState('');
  const [infoFeedback, setInfoFeedback] = useState('');
  const actionPending = useRef(false);
  const detail = useGetFollowUpOrderQuery(orderId, {
    refetchOnMountOrArgChange: true,
  });
  const [transition, transitionState] = useTransitionOrderMutation();
  const [updateOrderInfo, updateInfoState] = useUpdateOrderInfoMutation();
  const order = detail.currentData?.Data;
  const validActions = order ? getValidOrderTransitions(order.OrderStatus) : [];

  useEffect(() => {
    if (order && !editingInfo) setInfoDraft(orderInfoDraft(order));
  }, [order, editingInfo]);

  const changeInfo = (field: keyof OrderInfoDraft, value: string) => {
    setInfoDraft(current => {
      if (!current) return current;
      const next = {...current, [field]: value};
      if (field === 'DeliveryZone' && value === 'inside_dhaka') {
        next.Division = 'Dhaka';
        next.District = 'Dhaka';
      }
      return next;
    });
  };

  const saveInfo = async () => {
    if (!order || !infoDraft || updateInfoState.isLoading || mustReload) return;
    setInfoFeedback('');
    const phone = infoDraft.PhoneNumber.replace(/[\s-]/g, '').replace(
      /^\+?88/,
      '',
    );
    const required = [
      infoDraft.CustomerName,
      phone,
      infoDraft.Division,
      infoDraft.District,
      infoDraft.Area,
      infoDraft.PostCode,
      infoDraft.Address,
    ];
    if (required.some(value => !value.trim())) {
      setInfoFeedback('Complete all required customer and delivery fields.');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setInfoFeedback('Enter a valid Bangladesh mobile number.');
      return;
    }
    try {
      await updateOrderInfo({
        ItemId: order._id,
        ExpectedVersion: order.Version,
        ...infoDraft,
        PhoneNumber: phone,
        UpdateDoneBy: updateDoneBy,
        Note: updateNote.trim() || undefined,
      }).unwrap();
      setEditingInfo(false);
      setUpdateNote('');
      setInfoFeedback('Customer and delivery information updated.');
    } catch (error) {
      if (isConflictError(error)) setMustReload(true);
      setInfoFeedback(
        isConflictError(error)
          ? 'This order changed. Reload it before saving your correction.'
          : 'The order information could not be updated.',
      );
    }
  };

  const act = async (status: Exclude<OrderStatus, 'pending'>) => {
    if (!order || actionPending.current || mustReload) return;
    actionPending.current = true;
    setFeedback('');
    try {
      await transition({
        ItemId: order._id,
        Status: status,
        ExpectedVersion: order.Version,
        Note: note.trim() || undefined,
      }).unwrap();
      setNote('');
      setFeedback(`Order moved to ${status}.`);
    } catch (error) {
      const conflict = isConflictError(error);
      setMustReload(true);
      setFeedback(
        conflict
          ? 'This order changed or stock is unavailable. Reload it before trying again.'
          : 'The order could not be updated. Reload it before trying again.',
      );
    } finally {
      actionPending.current = false;
    }
  };

  const reload = async () => {
    setFeedback('');
    try {
      await detail.refetch().unwrap();
      setMustReload(false);
    } catch {
      setFeedback('The latest order could not be loaded. Please try again.');
    }
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={
        transitionState.isLoading || updateInfoState.isLoading
          ? undefined
          : onClose
      }
      PaperProps={{
        sx: {
          width: fullScreen ? '100%' : '700px',
          maxWidth: '100vw',
          overflow: 'hidden',
          bgcolor: 'background.default',
        },
      }}
      aria-label="Order details">
      <Box
        sx={{
          height: '100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Box
          component="header"
          sx={{
            position: 'relative',
            zIndex: '1',
            flexShrink: 0,
            px: {xs: '16px', sm: '24px'},
            py: {xs: '16px', sm: '20px'},
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
            }}>
            <Box sx={{minWidth: 0, flex: '1 1 auto'}}>
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={800}
                sx={{display: 'block', letterSpacing: '0.08em'}}>
                Fulfillment record
              </Typography>
              <Typography
                component="h2"
                variant="h5"
                fontWeight={900}
                sx={{
                  mt: '4px',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.25,
                }}>
                {order?.OrderNumber ?? 'Loading order'}
              </Typography>
              {order && (
                <Box
                  sx={{
                    mt: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                  <StatusChip status={order.OrderStatus} />
                  <Typography variant="caption" color="text.secondary">
                    Version {order.Version}
                  </Typography>
                </Box>
              )}
            </Box>
            <IconButton
              aria-label="Close order details"
              onClick={onClose}
              disabled={transitionState.isLoading || updateInfoState.isLoading}
              sx={{flexShrink: 0}}>
              <IconX />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            px: {xs: '12px', sm: '24px'},
            py: {xs: '16px', sm: '24px'},
            overflowY: 'auto',
            flex: '1 1 auto',
            minHeight: 0,
          }}
          aria-live="polite">
          {detail.isFetching && !order && (
            <Stack gap="16px" role="status" aria-label="Loading order details">
              <Skeleton height={36} />
              <Skeleton height={110} />
              <Skeleton height={180} />
            </Stack>
          )}
          {detail.isError && (
            <Alert
              severity="error"
              action={<Button onClick={reload}>Retry</Button>}>
              Could not load this order.
            </Alert>
          )}
          {order && !detail.isError && (
            <Stack gap="18px">
              <DetailSection title="Customer & delivery">
                <Stack gap="14px">
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}>
                    {!editingInfo ? (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={mustReload}
                        onClick={() => {
                          setInfoDraft(orderInfoDraft(order));
                          setInfoFeedback('');
                          setEditingInfo(true);
                        }}>
                        Edit order information
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditingInfo(false);
                            setInfoDraft(orderInfoDraft(order));
                            setInfoFeedback('');
                          }}
                          disabled={updateInfoState.isLoading}>
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={saveInfo}
                          disabled={updateInfoState.isLoading || mustReload}>
                          {updateInfoState.isLoading
                            ? 'Saving...'
                            : 'Save correction'}
                        </Button>
                      </>
                    )}
                  </Box>
                  {infoFeedback && (
                    <Alert
                      severity={
                        infoFeedback.includes('updated') ? 'success' : 'error'
                      }>
                      {infoFeedback}
                    </Alert>
                  )}
                  {editingInfo && infoDraft ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'minmax(0, 1fr)',
                          sm: 'repeat(2, minmax(0, 1fr))',
                        },
                        gap: '16px',
                      }}>
                      <TextField
                        required
                        label="Customer name"
                        value={infoDraft.CustomerName}
                        onChange={event =>
                          changeInfo('CustomerName', event.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Phone number"
                        value={infoDraft.PhoneNumber}
                        onChange={event =>
                          changeInfo('PhoneNumber', event.target.value)
                        }
                      />
                      <FormControl required>
                        <InputLabel id="delivery-zone-edit-label">
                          Delivery zone
                        </InputLabel>
                        <Select
                          labelId="delivery-zone-edit-label"
                          label="Delivery zone"
                          value={infoDraft.DeliveryZone}
                          onChange={event =>
                            changeInfo('DeliveryZone', event.target.value)
                          }>
                          <MenuItem value="inside_dhaka">Inside Dhaka</MenuItem>
                          <MenuItem value="outside_dhaka">
                            Outside Dhaka
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        required
                        label="Area"
                        value={infoDraft.Area}
                        onChange={event =>
                          changeInfo('Area', event.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Division"
                        value={infoDraft.Division}
                        disabled={infoDraft.DeliveryZone === 'inside_dhaka'}
                        onChange={event =>
                          changeInfo('Division', event.target.value)
                        }
                      />
                      <TextField
                        required
                        label="District"
                        value={infoDraft.District}
                        disabled={infoDraft.DeliveryZone === 'inside_dhaka'}
                        onChange={event =>
                          changeInfo('District', event.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Post code"
                        value={infoDraft.PostCode}
                        onChange={event =>
                          changeInfo('PostCode', event.target.value)
                        }
                      />
                      <TextField
                        required
                        label="Address"
                        value={infoDraft.Address}
                        onChange={event =>
                          changeInfo('Address', event.target.value)
                        }
                        sx={{gridColumn: {sm: '1 / -1'}}}
                      />
                      <TextField
                        label="Delivery notes"
                        multiline
                        minRows={2}
                        value={infoDraft.DeliveryNotes}
                        onChange={event =>
                          changeInfo('DeliveryNotes', event.target.value)
                        }
                        sx={{gridColumn: {sm: '1 / -1'}}}
                      />
                      <FormControl required>
                        <InputLabel id="update-channel-label">
                          Confirmed through
                        </InputLabel>
                        <Select
                          labelId="update-channel-label"
                          label="Confirmed through"
                          value={updateDoneBy}
                          onChange={event =>
                            setUpdateDoneBy(
                              event.target.value as OrderUpdateChannel,
                            )
                          }>
                          {updateChannels.map(channel => (
                            <MenuItem key={channel.value} value={channel.value}>
                              {channel.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Update note (optional)"
                        value={updateNote}
                        onChange={event =>
                          setUpdateNote(event.target.value.slice(0, 1000))
                        }
                        helperText={`${updateNote.length}/1000 characters`}
                        sx={{gridColumn: {sm: '1 / -1'}}}
                      />
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6" fontWeight={800}>
                        {order.CustomerName}
                      </Typography>
                      <Link
                        href={`tel:${order.PhoneNumber.replace(/[^+\d]/g, '')}`}
                        underline="hover"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: 'fit-content',
                          overflowWrap: 'anywhere',
                        }}>
                        <IconPhone size={18} />
                        <span>{order.PhoneNumber}</span>
                      </Link>
                      <Typography
                        color="text.secondary"
                        sx={{overflowWrap: 'anywhere', lineHeight: 1.65}}>
                        {[
                          order.Address,
                          order.Area,
                          order.District,
                          order.Division,
                          order.PostCode,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Typography>
                      {order.DeliveryNotes && (
                        <Alert
                          severity="info"
                          icon={<IconTruckDelivery size={20} />}
                          sx={{mt: '8px'}}>
                          {order.DeliveryNotes}
                        </Alert>
                      )}
                    </>
                  )}
                </Stack>
              </DetailSection>

              <DetailSection title="Order items">
                <Stack gap="12px">
                  {order.Items.map((item, index) => (
                    <Paper
                      key={`${item.ProductId ?? item.ProductName}-${index}`}
                      variant="outlined"
                      sx={{
                        p: '16px',
                        borderRadius: '10px',
                        bgcolor: 'background.default',
                      }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: {xs: 'column', sm: 'row'},
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}>
                        <Box sx={{minWidth: 0}}>
                          <Typography
                            fontWeight={800}
                            sx={{overflowWrap: 'anywhere'}}>
                            {item.ProductName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[item.Category, item.SubCategory]
                              .filter(Boolean)
                              .join(' / ')}
                          </Typography>
                        </Box>
                        <Typography
                          textAlign={{xs: 'left', sm: 'right'}}
                          fontWeight={800}
                          sx={{flexShrink: 0, overflowWrap: 'anywhere'}}>
                          {item.Quantity} x {money(item.UnitPrice)}
                        </Typography>
                      </Box>
                      {item.CustomOptions &&
                        Object.keys(item.CustomOptions).length > 0 && (
                          <Box
                            component="dl"
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: {
                                xs: 'minmax(0, 1fr)',
                                sm: 'repeat(2, minmax(0, 1fr))',
                              },
                              gap: '10px 16px',
                              mt: '16px',
                              mb: '0px',
                              pt: '14px',
                              borderTop: '1px solid',
                              borderColor: 'divider',
                            }}>
                            {Object.entries(item.CustomOptions).map(
                              ([key, value]) => (
                                <Box key={key} sx={{minWidth: 0}}>
                                  <Typography
                                    component="dt"
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{overflowWrap: 'anywhere'}}>
                                    {key}
                                  </Typography>
                                  <Typography
                                    component="dd"
                                    variant="body2"
                                    sx={{m: '0px', overflowWrap: 'anywhere'}}>
                                    {value}
                                  </Typography>
                                </Box>
                              ),
                            )}
                          </Box>
                        )}
                    </Paper>
                  ))}
                </Stack>
              </DetailSection>

              <DetailSection title="Payment summary">
                <Stack gap="10px">
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) auto',
                      gap: '10px 20px',
                      alignItems: 'baseline',
                    }}>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight={700} textAlign="right">
                      {money(order.Subtotal)}
                    </Typography>
                    {(order.CouponDiscount ?? 0) > 0 && (
                      <>
                        <Typography color="text.secondary">Discount</Typography>
                        <Typography fontWeight={700} textAlign="right">
                          -{money(order.CouponDiscount)}
                        </Typography>
                      </>
                    )}
                    <Typography color="text.secondary">
                      Delivery charge
                    </Typography>
                    <Typography fontWeight={700} textAlign="right">
                      {money(order.ShippingCost)}
                    </Typography>
                  </Box>
                  <Divider sx={{my: '4px'}} />
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) auto',
                      gap: '20px',
                      alignItems: 'baseline',
                    }}>
                    <Typography variant="h6" fontWeight={900}>
                      Total
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={900}
                      textAlign="right"
                      sx={{overflowWrap: 'anywhere'}}>
                      {money(order.TotalAmount)}
                    </Typography>
                  </Box>
                  <Alert severity="warning" sx={{mt: '8px'}}>
                    Manual payment handling. Payment status:{' '}
                    {order.PaymentStatus}.
                  </Alert>
                </Stack>
              </DetailSection>

              <DetailSection title="Inventory movements">
                {order.StockMovements?.length ? (
                  <Stack gap="10px">
                    {order.StockMovements.map(movement => (
                      <Box
                        key={movement.ProductId}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) auto',
                          gap: '16px',
                          alignItems: 'center',
                        }}>
                        <Typography
                          variant="body2"
                          sx={{overflowWrap: 'anywhere'}}>
                          {movement.ProductId}
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {movement.Quantity}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No stock movement recorded yet.
                  </Typography>
                )}
              </DetailSection>

              <DetailSection title="Order history">
                {order.AuditHistory?.length ? (
                  <Box>
                    {[...order.AuditHistory].reverse().map((entry, index) => (
                      <Box
                        key={`${entry.At}-${index}`}
                        sx={{
                          position: 'relative',
                          pl: '28px',
                          pb:
                            index === order.AuditHistory!.length - 1
                              ? '0px'
                              : '22px',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: '7px',
                            top: '15px',
                            bottom: '0px',
                            width: '1px',
                            bgcolor:
                              index === order.AuditHistory!.length - 1
                                ? 'transparent'
                                : 'divider',
                          },
                        }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: '2px',
                            top: '5px',
                            width: '11px',
                            height: '11px',
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            border: '3px solid',
                            borderColor: 'background.paper',
                            boxSizing: 'content-box',
                          }}
                        />
                        <Typography
                          fontWeight={800}
                          sx={{textTransform: 'capitalize'}}>
                          {entry.EventType === 'order_info_updated'
                            ? 'Order information updated'
                            : entry.To || 'Created'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{display: 'block', overflowWrap: 'anywhere'}}>
                          {dateTime(entry.At)} / {entry.By}
                        </Typography>
                        {entry.UpdateDoneBy && (
                          <Typography
                            variant="caption"
                            color="primary.main"
                            sx={{display: 'block', mt: '3px'}}>
                            Confirmed through:{' '}
                            {updateChannels.find(
                              channel => channel.value === entry.UpdateDoneBy,
                            )?.label ?? entry.UpdateDoneBy}
                            {entry.ChangedFields?.length
                              ? ` / Changed: ${entry.ChangedFields.join(', ')}`
                              : ''}
                          </Typography>
                        )}
                        {entry.Note && (
                          <Typography
                            variant="body2"
                            sx={{mt: '6px', overflowWrap: 'anywhere'}}>
                            {entry.Note}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No audit events available.
                  </Typography>
                )}
              </DetailSection>
            </Stack>
          )}
        </Box>

        {order && !detail.isError && (
          <Box
            component="footer"
            sx={{
              flexShrink: 0,
              px: {xs: '12px', sm: '24px'},
              py: {xs: '14px', sm: '18px'},
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}>
            <Stack gap="12px">
              {feedback && (
                <Alert severity={mustReload ? 'error' : 'success'}>
                  {feedback}
                </Alert>
              )}
              {mustReload && (
                <Button
                  startIcon={<IconRefresh size={18} />}
                  onClick={reload}
                  disabled={detail.isFetching}
                  sx={{alignSelf: {sm: 'flex-start'}}}>
                  Reload latest order
                </Button>
              )}
              {validActions.length ? (
                <>
                  <TextField
                    label="Action note (optional)"
                    multiline
                    minRows={2}
                    value={note}
                    onChange={event =>
                      setNote(event.target.value.slice(0, 1000))
                    }
                    helperText={`${note.length}/1000 characters`}
                    slotProps={{htmlInput: {maxLength: 1000}}}
                    disabled={
                      transitionState.isLoading ||
                      updateInfoState.isLoading ||
                      editingInfo ||
                      mustReload
                    }
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: {xs: 'column', sm: 'row'},
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}>
                    {validActions.map(status => (
                      <Button
                        key={status}
                        variant={
                          status === 'cancelled' ? 'outlined' : 'contained'
                        }
                        color={status === 'cancelled' ? 'error' : 'primary'}
                        onClick={() =>
                          act(status as Exclude<OrderStatus, 'pending'>)
                        }
                        disabled={
                          transitionState.isLoading ||
                          updateInfoState.isLoading ||
                          editingInfo ||
                          mustReload ||
                          detail.isFetching
                        }
                        sx={{minWidth: {xs: '100%', sm: '160px'}}}>
                        {transitionState.isLoading
                          ? 'Saving...'
                          : actionLabels[
                              status as Exclude<OrderStatus, 'pending'>
                            ]}
                      </Button>
                    ))}
                  </Box>
                </>
              ) : (
                <Alert severity="info">
                  This order is in a terminal state and needs no further
                  fulfillment action.
                </Alert>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
export function OrdersConsole() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatusFilter>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [needsAction, setNeedsAction] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const request = useMemo(
    () =>
      buildOrdersRequest({
        page,
        status,
        search: debouncedSearch,
        from,
        to,
        needsAction,
      }),
    [page, status, debouncedSearch, from, to, needsAction],
  );
  const invalidDateRange = Boolean(from && to && from > to);
  const list = useListOrdersQuery(request, {
    refetchOnMountOrArgChange: true,
    skip: invalidDateRange,
  });
  const orders = invalidDateRange ? [] : (list.currentData?.Data ?? []);
  const total = invalidDateRange ? 0 : (list.currentData?.TotalCount ?? 0);
  const pageCount = Math.max(1, Math.ceil(total / 10));

  useEffect(() => {
    if (invalidDateRange) setSelectedOrder('');
  }, [invalidDateRange]);

  const updateFilter = (change: () => void) => {
    setPage(1);
    change();
  };

  return (
    <Box sx={{width: '100%', p: {xs: 2, md: 4}}}>
      <Stack spacing={3}>
        <Stack
          direction={{xs: 'column', md: 'row'}}
          justifyContent="space-between"
          gap={2}>
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              color="primary.main">
              <IconPackage size={22} />
              <Typography variant="overline" fontWeight={900}>
                Operations
              </Typography>
            </Stack>
            <Typography component="h1" variant="h4" fontWeight={900}>
              Order fulfillment
            </Typography>
            <Typography color="text.secondary">
              Review customer orders, protect stock, and move each delivery
              forward.
            </Typography>
          </Box>
          <Paper
            variant="outlined"
            sx={{px: 2.5, py: 1.5, alignSelf: {md: 'center'}}}>
            <Typography variant="caption" color="text.secondary">
              Matching orders
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {total}
            </Typography>
          </Paper>
        </Stack>

        <Paper
          component="section"
          aria-label="Order filters"
          variant="outlined"
          sx={{p: 2}}>
          <Stack
            direction={{xs: 'column', lg: 'row'}}
            spacing={1.5}
            alignItems={{lg: 'center'}}>
            <TextField
              label="Search orders"
              placeholder="Order number, customer, or phone"
              value={search}
              onChange={event =>
                updateFilter(() => setSearch(event.target.value))
              }
              size="small"
              sx={{minWidth: {lg: 300}, flex: 1}}
              slotProps={{
                input: {
                  startAdornment: (
                    <IconSearch size={18} style={{marginRight: 8}} />
                  ),
                },
              }}
            />
            <FormControl size="small" sx={{minWidth: 160}}>
              <InputLabel id="order-status-filter-label">Status</InputLabel>
              <Select
                labelId="order-status-filter-label"
                label="Status"
                value={status}
                onChange={event =>
                  updateFilter(() =>
                    setStatus(event.target.value as OrderStatusFilter),
                  )
                }>
                <MenuItem value="all">All statuses</MenuItem>
                {ORDER_STATUSES.map(item => (
                  <MenuItem key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="From"
              type="date"
              size="small"
              value={from}
              onChange={event =>
                updateFilter(() => setFrom(event.target.value))
              }
              slotProps={{
                inputLabel: {shrink: true},
                input: {
                  startAdornment: (
                    <IconCalendar size={17} style={{marginRight: 8}} />
                  ),
                },
              }}
            />
            <TextField
              label="To"
              type="date"
              size="small"
              value={to}
              onChange={event => updateFilter(() => setTo(event.target.value))}
              slotProps={{inputLabel: {shrink: true}}}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={needsAction}
                  onChange={event =>
                    updateFilter(() => setNeedsAction(event.target.checked))
                  }
                />
              }
              label="Needs action"
              sx={{whiteSpace: 'nowrap', mr: 0}}
            />
            <IconButton
              aria-label="Refresh orders"
              onClick={() => list.refetch()}
              disabled={list.isFetching}>
              <IconRefresh />
            </IconButton>
          </Stack>
        </Paper>

        {list.isError && (
          <Alert
            severity="error"
            action={<Button onClick={() => list.refetch()}>Retry</Button>}>
            Orders could not be loaded. Check the connection and try again.
          </Alert>
        )}
        {invalidDateRange && (
          <Alert severity="warning">
            The “From” date must be on or before the “To” date.
          </Alert>
        )}
        {list.isFetching && !list.currentData && (
          <Stack spacing={1} role="status" aria-label="Loading orders">
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
          </Stack>
        )}
        {list.isFetching && list.currentData && (
          <Stack direction="row" alignItems="center" gap={1} role="status">
            <CircularProgress size={18} />
            <Typography variant="body2">Refreshing orders…</Typography>
          </Stack>
        )}
        {!invalidDateRange &&
          !list.isError &&
          !list.isFetching &&
          orders.length === 0 && (
            <Paper
              variant="outlined"
              sx={{p: 6, textAlign: 'center'}}
              role="status">
              <IconPackage size={42} stroke={1.4} />
              <Typography variant="h6" fontWeight={800} sx={{mt: 1}}>
                No matching orders
              </Typography>
              <Typography color="text.secondary">
                Adjust the filters or search term to widen the queue.
              </Typography>
            </Paper>
          )}

        {!invalidDateRange && orders.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{display: {xs: 'none', md: 'block'}}}>
              <Table aria-label="Customer orders">
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Typography fontWeight={800}>
                          {order.OrderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={700}>
                          {order.CustomerName}
                        </Typography>
                        <Link
                          href={`tel:${order.PhoneNumber.replace(/[^+\d]/g, '')}`}
                          variant="body2">
                          {order.PhoneNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {dateTime(order.CreatedDate ?? order.createdAt)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={800}>
                          {money(order.TotalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${order.PaymentStatus} / manual`}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.OrderStatus} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          endIcon={<IconArrowRight size={17} />}
                          onClick={() => setSelectedOrder(order._id)}
                          aria-label={`Review order ${order.OrderNumber}`}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack spacing={1.5} sx={{display: {xs: 'flex', md: 'none'}}}>
              {orders.map(order => (
                <OrderRecord
                  key={order._id}
                  order={order}
                  onOpen={() => setSelectedOrder(order._id)}
                />
              ))}
            </Stack>
            <Stack
              direction={{xs: 'column', sm: 'row'}}
              justifyContent="space-between"
              alignItems="center"
              gap={1}>
              <Typography variant="body2" color="text.secondary">
                Page {page} of {pageCount} · {total} orders
              </Typography>
              <Pagination
                page={page}
                count={pageCount}
                onChange={(_, value) => setPage(value)}
                color="primary"
                disabled={list.isFetching}
                showFirstButton
                showLastButton
              />
            </Stack>
          </>
        )}
      </Stack>
      {!invalidDateRange && selectedOrder && (
        <OrderDetailsDrawer
          orderId={selectedOrder}
          onClose={() => setSelectedOrder('')}
        />
      )}
    </Box>
  );
}

export default function Orders() {
  const canAccess = useAppSelector(state =>
    canAccessOrderFulfillment(selectCurrentUserRoles(state)),
  );
  return canAccess ? <OrdersConsole /> : <Navigate to="/dashboard" replace />;
}
