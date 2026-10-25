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
  OrderStatus,
  useGetFollowUpOrderQuery,
  useListOrdersQuery,
  useTransitionOrderMutation,
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
    <Box component="section">
      <Typography variant="overline" color="text.secondary" fontWeight={800}>
        {title}
      </Typography>
      <Box sx={{mt: 0.75}}>{children}</Box>
    </Box>
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
  const actionPending = useRef(false);
  const detail = useGetFollowUpOrderQuery(orderId, {
    refetchOnMountOrArgChange: true,
  });
  const [transition, transitionState] = useTransitionOrderMutation();
  const order = detail.currentData?.Data;
  const validActions = order ? getValidOrderTransitions(order.OrderStatus) : [];

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
      onClose={transitionState.isLoading ? undefined : onClose}
      PaperProps={{
        sx: {width: fullScreen ? '100%' : 560, maxWidth: '100vw'},
      }}
      aria-label="Order details">
      <Stack sx={{height: '100%'}}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{p: 2.5}}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Fulfillment record
            </Typography>
            <Typography variant="h5" fontWeight={800}>
              {order?.OrderNumber ?? 'Loading order'}
            </Typography>
          </Box>
          <IconButton
            aria-label="Close order details"
            onClick={onClose}
            disabled={transitionState.isLoading}>
            <IconX />
          </IconButton>
        </Stack>
        <Divider />

        <Box sx={{p: 2.5, overflowY: 'auto', flex: 1}} aria-live="polite">
          {detail.isFetching && !order && (
            <Stack
              spacing={1.5}
              role="status"
              aria-label="Loading order details">
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
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={1}>
                <StatusChip status={order.OrderStatus} />
                <Typography variant="body2" color="text.secondary">
                  Version {order.Version}
                </Typography>
              </Stack>

              <DetailSection title="Customer & delivery">
                <Stack spacing={0.75}>
                  <Typography fontWeight={800}>{order.CustomerName}</Typography>
                  <Link
                    href={`tel:${order.PhoneNumber.replace(/[^+\d]/g, '')}`}
                    sx={{display: 'inline-flex', gap: 1}}>
                    <IconPhone size={18} /> {order.PhoneNumber}
                  </Link>
                  <Typography color="text.secondary">
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
                      icon={<IconTruckDelivery size={20} />}>
                      {order.DeliveryNotes}
                    </Alert>
                  )}
                </Stack>
              </DetailSection>

              <DetailSection title="Order items">
                <Stack spacing={1.5}>
                  {order.Items.map((item, index) => (
                    <Paper
                      key={`${item.ProductId ?? item.ProductName}-${index}`}
                      variant="outlined"
                      sx={{p: 1.5}}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        gap={2}>
                        <Box>
                          <Typography fontWeight={800}>
                            {item.ProductName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[item.Category, item.SubCategory]
                              .filter(Boolean)
                              .join(' / ')}
                          </Typography>
                        </Box>
                        <Typography textAlign="right" fontWeight={700}>
                          {item.Quantity} × {money(item.UnitPrice)}
                        </Typography>
                      </Stack>
                      {item.CustomOptions &&
                        Object.keys(item.CustomOptions).length > 0 && (
                          <Box
                            component="dl"
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 0.75,
                              mt: 1.5,
                              mb: 0,
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
                                    sx={{m: 0, overflowWrap: 'anywhere'}}>
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
                <Paper variant="outlined" sx={{p: 2}}>
                  <Stack spacing={0.75}>
                    <Stack direction="row" justifyContent="space-between">
                      <span>Subtotal</span>
                      <strong>{money(order.Subtotal)}</strong>
                    </Stack>
                    {(order.CouponDiscount ?? 0) > 0 && (
                      <Stack direction="row" justifyContent="space-between">
                        <span>Discount</span>
                        <strong>-{money(order.CouponDiscount)}</strong>
                      </Stack>
                    )}
                    <Stack direction="row" justifyContent="space-between">
                      <span>Delivery charge</span>
                      <strong>{money(order.ShippingCost)}</strong>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={800}>Total</Typography>
                      <Typography fontWeight={900}>
                        {money(order.TotalAmount)}
                      </Typography>
                    </Stack>
                    <Alert severity="warning">
                      Manual payment handling. Payment status:{' '}
                      {order.PaymentStatus}.
                    </Alert>
                  </Stack>
                </Paper>
              </DetailSection>

              <DetailSection title="Inventory movements">
                {order.StockMovements?.length ? (
                  <Stack spacing={0.75}>
                    {order.StockMovements.map(movement => (
                      <Stack
                        key={movement.ProductId}
                        direction="row"
                        justifyContent="space-between"
                        gap={2}>
                        <Typography
                          variant="body2"
                          sx={{overflowWrap: 'anywhere'}}>
                          {movement.ProductId}
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {movement.Quantity}
                        </Typography>
                      </Stack>
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
                  <Stack spacing={0}>
                    {[...order.AuditHistory].reverse().map((entry, index) => (
                      <Box
                        key={`${entry.At}-${index}`}
                        sx={{
                          position: 'relative',
                          pl: 3,
                          pb: 2,
                          borderLeft:
                            index === order.AuditHistory!.length - 1 ? 0 : 2,
                          borderColor: 'divider',
                        }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -6,
                            top: 3,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                          }}
                        />
                        <Typography fontWeight={800}>
                          {entry.To || 'Created'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dateTime(entry.At)} · {entry.By}
                        </Typography>
                        {entry.Note && (
                          <Typography variant="body2" sx={{mt: 0.5}}>
                            {entry.Note}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No audit events available.
                  </Typography>
                )}
              </DetailSection>

              <Divider />
              {feedback && (
                <Alert severity={mustReload ? 'error' : 'success'}>
                  {feedback}
                </Alert>
              )}
              {mustReload && (
                <Button
                  startIcon={<IconRefresh size={18} />}
                  onClick={reload}
                  disabled={detail.isFetching}>
                  Reload latest order
                </Button>
              )}
              {validActions.length ? (
                <Stack spacing={1.5}>
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
                    disabled={transitionState.isLoading || mustReload}
                  />
                  <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
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
                          mustReload ||
                          detail.isFetching
                        }>
                        {transitionState.isLoading
                          ? 'Saving…'
                          : actionLabels[
                              status as Exclude<OrderStatus, 'pending'>
                            ]}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              ) : (
                <Alert severity="info">
                  This order is in a terminal state and needs no further
                  fulfillment action.
                </Alert>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
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
