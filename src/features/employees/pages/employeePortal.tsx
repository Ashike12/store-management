import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {useMemo, useState} from 'react';
import {useGetEmployeeOverviewQuery, useSubmitFeedbackMutation} from '@core/store/api/employeeApi';
import {DashboardSkeleton} from '@components/loaders/AdminSkeleton';

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString('en-BD', {minimumFractionDigits: 2})}`;

export default function EmployeePortal() {
  const overview = useGetEmployeeOverviewQuery({});
  const [submitFeedback, feedbackState] = useSubmitFeedbackMutation();
  const [tab, setTab] = useState(0);
  const [feedbackTarget, setFeedbackTarget] = useState<{TargetType: 'work' | 'payment'; TargetId: string} | null>(null);
  const [explanation, setExplanation] = useState('');
  const existingTargets = useMemo(
    () => new Set(overview.data?.Data.Feedback.map(item => `${item.TargetType}:${item.TargetId}`) ?? []),
    [overview.data],
  );

  if (overview.isLoading) return <DashboardSkeleton />;
  if (overview.isError || !overview.data) return <Box p={4}><Alert severity="error">Your work history could not be loaded. Please try again.</Alert></Box>;
  const data = overview.data.Data;
  const summary = data.Summary;

  return <Box sx={{p: {xs: 2, md: 4}, maxWidth: 1200, mx: 'auto'}}>
    <Box mb={3}>
      <Typography variant="overline" color="primary">Employee workspace</Typography>
      <Typography variant="h4" fontWeight={800}>Welcome, {data.Employee.DisplayName}</Typography>
      <Typography color="text.secondary">Review your daily work, payments and balance. If something looks wrong, send a review request from that entry.</Typography>
    </Box>

    <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(3,1fr)'}, gap: 2, mb: 3}}>
      <SummaryCard title="Total work earned" value={summary.TotalEarned} tone="primary" />
      <SummaryCard title="Payments received" value={summary.TotalPaid} tone="info" />
      <SummaryCard
        title={summary.BalanceDirection === 'business_owes_employee' ? 'Amount you will receive' : summary.BalanceDirection === 'employee_owes_business' ? 'Advance received' : 'Balance settled'}
        value={Math.abs(summary.Balance)}
        tone={summary.Balance === 0 ? 'success' : 'warning'}
      />
    </Box>

    <Card variant="outlined" sx={{mb: 3, p: 2}}>
      <Typography fontWeight={800} mb={1}>Daily work summary</Typography>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {data.DailyWork.length === 0 && <Typography color="text.secondary">No work entries yet.</Typography>}
        {data.DailyWork.map(day => <Chip key={day.WorkDate} variant="outlined" label={`${day.WorkDate}: ${money(day.Amount)}`} />)}
      </Stack>
    </Card>

    <Card variant="outlined">
      <Tabs value={tab} onChange={(_event, value) => setTab(value)} variant="scrollable">
        <Tab label={`Work history (${data.WorkEntries.length})`} />
        <Tab label={`Payment history (${data.PaymentEntries.length})`} />
        <Tab label={`My review requests (${data.Feedback.length})`} />
      </Tabs>
      <Divider />
      <Box p={{xs: 2, md: 3}}>
        {tab === 0 && <Stack divider={<Divider flexItem />}>
          {data.WorkEntries.length === 0 && <Alert severity="info">No work has been recorded yet.</Alert>}
          {data.WorkEntries.map(entry => <HistoryRow key={entry.ItemId} title={entry.Description} subtitle={`${entry.WorkDate}${entry.BatchId ? ` | Batch ${entry.BatchId}` : ''}`} amount={entry.Amount} reviewed={existingTargets.has(`work:${entry.ItemId}`)} onReview={() => setFeedbackTarget({TargetType: 'work', TargetId: entry.ItemId})} />)}
        </Stack>}
        {tab === 1 && <Stack divider={<Divider flexItem />}>
          {data.PaymentEntries.length === 0 && <Alert severity="info">No payments have been recorded yet.</Alert>}
          {data.PaymentEntries.map(entry => <HistoryRow key={entry.ItemId} title={entry.Note || 'Employee payment'} subtitle={`${entry.PaymentDate}${entry.Reference ? ` | ${entry.Reference}` : ''}`} amount={entry.Amount} reviewed={existingTargets.has(`payment:${entry.ItemId}`)} onReview={() => setFeedbackTarget({TargetType: 'payment', TargetId: entry.ItemId})} />)}
        </Stack>}
        {tab === 2 && <Stack gap={2}>
          {data.Feedback.length === 0 && <Alert severity="info">You have not raised any review requests.</Alert>}
          {data.Feedback.map(item => <Card key={item.ItemId} variant="outlined" sx={{p: 2}}><Stack direction="row" justifyContent="space-between" gap={2}><Box><Typography fontWeight={700}>{item.TargetType === 'work' ? 'Work entry' : 'Payment'} review</Typography><Typography>{item.Explanation}</Typography>{item.ResolutionNote && <Typography color="text.secondary" variant="body2">Admin response: {item.ResolutionNote}</Typography>}</Box><Chip label={item.Status} size="small" color={item.Status === 'accepted' ? 'success' : item.Status === 'pending' ? 'warning' : 'default'} /></Stack></Card>)}
        </Stack>}
      </Box>
    </Card>

    <Dialog open={Boolean(feedbackTarget)} onClose={() => setFeedbackTarget(null)} fullWidth maxWidth="sm">
      <DialogTitle>Request an admin review</DialogTitle>
      <DialogContent><Typography color="text.secondary" mb={2}>Explain what appears incorrect. The admin will accept or decline with a note; accepting does not silently change the ledger.</Typography><TextField autoFocus fullWidth multiline rows={4} label="What should be reviewed?" value={explanation} onChange={event => setExplanation(event.target.value)} /></DialogContent>
      <DialogActions><Button onClick={() => setFeedbackTarget(null)}>Cancel</Button><Button variant="contained" disabled={!explanation.trim() || feedbackState.isLoading} onClick={async () => {
        if (!feedbackTarget) return;
        await submitFeedback({...feedbackTarget, Explanation: explanation.trim()}).unwrap();
        setFeedbackTarget(null); setExplanation('');
      }}>Send request</Button></DialogActions>
    </Dialog>
  </Box>;
}

function SummaryCard({title, value, tone}: {title: string; value: number; tone: string}) {
  return <Card variant="outlined" sx={{p: 2.5, borderTop: 3, borderTopColor: `${tone}.main`}}><Typography color="text.secondary" variant="body2">{title}</Typography><Typography variant="h5" fontWeight={800}>{money(value)}</Typography></Card>;
}

function HistoryRow({title, subtitle, amount, reviewed, onReview}: {title: string; subtitle: string; amount: number; reviewed: boolean; onReview: () => void}) {
  return <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} gap={2} py={2}><Box><Typography fontWeight={700}>{title}</Typography><Typography variant="caption" color="text.secondary">{subtitle}</Typography></Box><Stack direction="row" alignItems="center" gap={2}><Typography fontWeight={800}>{money(amount)}</Typography><Button size="small" variant="outlined" disabled={reviewed} onClick={onReview}>{reviewed ? 'Review sent' : 'Request review'}</Button></Stack></Stack>;
}
