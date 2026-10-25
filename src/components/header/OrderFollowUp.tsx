import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Link, Stack, TextField, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import {useAppSelector} from '@core/store/hooks';
import {selectCurrentUserRoles} from '@core/store/slices/auth.slice';
import {
  FollowUpOrder, useGetFollowUpOrderQuery, useListFollowUpOrdersQuery,
  useTransitionOrderMutation,
} from '@core/store/api/ordersApi';

function useFollowUpTranslation() {
  const {t, i18n} = useTranslation('translation', {keyPrefix: 'ORDER_FOLLOW_UP'});
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  const locale = language.startsWith('bn') ? 'bn-BD' : language.startsWith('zh') ? 'zh-CN' : 'en-BD';
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const money = (value: number) => new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'BDT',
  }).format(value);
  return {t, number, money};
}

function OrderSummary({order}: {order: FollowUpOrder}) {
  const {t, money} = useFollowUpTranslation();
  return (
    <Stack spacing={1} sx={{overflowWrap: 'anywhere'}}>
      <Typography variant="subtitle1" component="h3">{t('order', {number: order.OrderNumber})}</Typography>
      <Typography>{order.CustomerName}</Typography>
      <Link href={`tel:${order.PhoneNumber.replace(/[^+\d]/g, '')}`}>
        {t('call', {phone: order.PhoneNumber})}
      </Link>
      <Typography variant="body2" color="text.secondary">
        {t('delivery', {address: [order.Address, order.Area, order.District, order.Division].filter(Boolean).join(', ')})}
      </Typography>
      <Typography variant="body2">
        {t('totals', {total: money(order.TotalAmount), shipping: money(order.ShippingCost)})}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('payment', {status: t(`statuses.${order.OrderStatus}`, {defaultValue: t('statuses.unknown')})})}
      </Typography>
    </Stack>
  );
}

function FollowUpQueue() {
  const {t, number, money} = useFollowUpTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState<{status: 'confirmed' | 'cancelled'; number: string} | null>(null);
  const [actionError, setActionError] = useState('');
  const [needsReview, setNeedsReview] = useState(false);
  const actionPending = useRef(false);
  const count = useListFollowUpOrdersQuery({Page: 1, Size: 1}, {pollingInterval: 30000});
  const list = useListFollowUpOrdersQuery({Page: page, Size: 10}, {
    skip: !open, pollingInterval: 30000, refetchOnMountOrArgChange: true,
  });
  const detail = useGetFollowUpOrderQuery(selected, {
    skip: !open || !selected, refetchOnMountOrArgChange: true,
  });
  const [transition, {isLoading: saving}] = useTransitionOrderMutation();
  const order = detail.currentData?.Data;
  const total = list.currentData?.TotalCount ?? 0;
  const countLabel = count.isError ? t('unavailable') : count.data?.TotalCount === undefined
    ? t('loading') : number(count.data.TotalCount);

  const choose = (id: string) => {
    setSelected(id);
    setNote('');
    setActionError('');
    setNeedsReview(false);
  };
  const close = () => {
    if (actionPending.current) return;
    setOpen(false);
    choose('');
  };
  const act = async (Status: 'confirmed' | 'cancelled') => {
    if (!order?.RequiresImmediateAction || actionPending.current || needsReview || detail.isFetching || detail.isError) return;
    actionPending.current = true;
    setActionError('');
    setMessage(null);
    try {
      await transition({ItemId: order._id, Status, ExpectedVersion: order.Version, Note: note.trim()}).unwrap();
      setMessage({status: Status, number: order.OrderNumber});
      choose('');
      setPage(1);
    } catch (error) {
      const conflict = typeof error === 'object' && error !== null && 'status' in error && error.status === 409;
      setActionError(conflict ? 'conflict' : 'actionError');
      setNeedsReview(true);
    } finally {
      actionPending.current = false;
    }
  };

  return (
    <>
      <Button color="warning" variant="contained" aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {setOpen(true); setPage(1); setMessage(null);}}
        sx={{bgcolor: 'warning.main', color: 'warning.contrastText'}}>
        <span aria-live="polite">{t('indicator', {value: countLabel})}</span>
      </Button>
      <Dialog open={open} onClose={close} fullWidth fullScreen={mobile} maxWidth="sm"
        aria-labelledby="order-follow-up-title" aria-describedby="order-follow-up-description">
        <DialogTitle id="order-follow-up-title">{t('title')}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="order-follow-up-description" sx={{mb: 2}}>
            {t('description')}
          </DialogContentText>
          <Stack spacing={2}>
            {count.isError && <Alert severity="warning">{t('countError')}
              <Button onClick={() => count.refetch()} disabled={count.isFetching}>{t('retryCount')}</Button>
            </Alert>}
            {message && <Alert severity="success" role="status">{t(`${message.status}Message`, {number: message.number})}</Alert>}
            {selected ? (
              <>
                <Button onClick={() => choose('')} disabled={saving}>{t('back')}</Button>
                {detail.isFetching && <Typography role="status">{t('loadingOrder')}</Typography>}
                {detail.isError && <Alert severity="error">{t('detailError')}
                  <Button onClick={() => detail.refetch()}>{t('retry')}</Button>
                </Alert>}
                {order && !detail.isError && <>
                  <OrderSummary order={order} />
                  <Box component="ul" aria-label={t('items')} sx={{pl: 3, m: 0, overflowWrap: 'anywhere'}}>
                    {order.Items.map((item, index) => <Box component="li" key={index} sx={{mb: 1}}>
                      <Typography>{item.ProductName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('item', {quantity: number(item.Quantity), price: money(item.UnitPrice)})}
                      </Typography>
                    </Box>)}
                  </Box>
                  {!order.RequiresImmediateAction && <Alert severity="info">{t('handled')}</Alert>}
                  <TextField label={t('note')} multiline minRows={3} fullWidth value={note}
                    disabled={saving} onChange={event => setNote(event.target.value.slice(0, 1000))}
                    slotProps={{htmlInput: {maxLength: 1000}}}
                    helperText={t('noteHelp', {length: number(note.length), limit: number(1000)})} />
                </>}
                {actionError && <Alert severity="error">{t(actionError)}</Alert>}
                {needsReview && <Button disabled={detail.isFetching} onClick={async () => {
                  try {
                    await detail.refetch().unwrap();
                    setNeedsReview(false);
                    setActionError('');
                  } catch { /* The query error provides the retry state. */ }
                }}>{t('reload')}</Button>}
                <Stack direction={{xs: 'column', sm: 'row'}} spacing={1}>
                  <Button variant="contained" onClick={() => act('confirmed')}
                    disabled={saving || detail.isFetching || detail.isError || needsReview || !order?.RequiresImmediateAction}>
                    {t('confirm')}
                  </Button>
                  <Button color="error" variant="outlined" onClick={() => act('cancelled')}
                    disabled={saving || detail.isFetching || detail.isError || needsReview || !order?.RequiresImmediateAction}>
                    {t('cancel')}
                  </Button>
                </Stack>
                {saving && <Typography role="status">{t('saving')}</Typography>}
              </>
            ) : (
              <>
                {list.isFetching && <Typography role="status">{t('refreshing')}</Typography>}
                {list.isError ? <Alert severity="error">{t('listError')}
                  <Button onClick={() => list.refetch()}>{t('retry')}</Button>
                </Alert> : <>
                  {list.currentData?.Data.length === 0 && <Typography role="status">
                    {t(page === 1 ? 'empty' : 'emptyPage')}
                  </Typography>}
                  <Box component="ul" sx={{listStyle: 'none', p: 0, m: 0}}>
                    {list.currentData?.Data.map(item => (
                      <Box component="li" key={item._id} sx={{py: 2, borderBottom: 1, borderColor: 'divider'}}>
                        <OrderSummary order={item} />
                        <Button sx={{mt: 1}} variant="outlined" onClick={() => choose(item._id)}
                          aria-label={t('reviewLabel', {number: item.OrderNumber})}>{t('review')}</Button>
                      </Box>
                    ))}
                  </Box>
                </>}
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Button disabled={page === 1 || list.isFetching} onClick={() => setPage(value => value - 1)}>{t('previous')}</Button>
                  <Typography variant="body2">{t('page', {page: number(page)})}</Typography>
                  <Button disabled={page * 10 >= total || list.isFetching || list.isError}
                    onClick={() => setPage(value => value + 1)}>{t('next')}</Button>
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={close} disabled={saving}>{t('close')}</Button></DialogActions>
      </Dialog>
    </>
  );
}

export default function OrderFollowUp() {
  const isAdmin = useAppSelector(state => selectCurrentUserRoles(state).includes('admin'));
  // Non-admins never mount query hooks or retain an open follow-up dialog.
  return isAdmin ? <FollowUpQueue /> : null;
}
