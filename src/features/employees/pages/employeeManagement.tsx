import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {IconEdit, IconPlus, IconTrash, IconUserOff} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {IEmployeeBatchOption, IEmployeeSummary, IPaymentEntry, IWorkEntry} from '@core/interfaces/api/IEmployee';
import {
  useCreateEmployeeMutation,
  useCreatePaymentEntryMutation,
  useCreateWorkEntryMutation,
  useDeactivateEmployeeMutation,
  useDeletePaymentEntryMutation,
  useDeleteWorkEntryMutation,
  useGetEmployeeOverviewQuery,
  useListEmployeesQuery,
  useListEmployeeBatchesQuery,
  useResolveFeedbackMutation,
  useUpdateEmployeeMutation,
  useUpdatePaymentEntryMutation,
  useUpdateWorkEntryMutation,
} from '@core/store/api/employeeApi';
import {DetailSkeleton} from '@components/loaders/AdminSkeleton';

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString('en-BD', {minimumFractionDigits: 2})}`;
const today = () => new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Dhaka'});

type LedgerDialogState =
  | {kind: 'work'; value?: IWorkEntry}
  | {kind: 'payment'; value?: IPaymentEntry}
  | null;

type EmployeeForm = {
  FirstName: string;
  LastName: string;
  DisplayName: string;
  Email: string;
  Phone: string;
  Address: string;
  Password: string;
};

export default function EmployeeManagement() {
  const employees = useListEmployeesQuery({Status: 'all', Page: 1, Size: 100});
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get('employee') ?? '');
  const overview = useGetEmployeeOverviewQuery(
    {EmployeeId: selectedId},
    {skip: !selectedId},
  );
  const [tab, setTab] = useState(0);
  const [employeeDialog, setEmployeeDialog] = useState<IEmployeeSummary | 'new' | null>(null);
  const [ledgerDialog, setLedgerDialog] = useState<LedgerDialogState>(null);
  const [message, setMessage] = useState<{severity: 'success' | 'error'; text: string} | null>(null);
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deactivateEmployee] = useDeactivateEmployeeMutation();
  const [createWork] = useCreateWorkEntryMutation();
  const [updateWork] = useUpdateWorkEntryMutation();
  const [deleteWork] = useDeleteWorkEntryMutation();
  const [createPayment] = useCreatePaymentEntryMutation();
  const [updatePayment] = useUpdatePaymentEntryMutation();
  const [deletePayment] = useDeletePaymentEntryMutation();
  const [resolveFeedback] = useResolveFeedbackMutation();

  useEffect(() => {
    if (!selectedId && employees.data?.Data[0]) setSelectedId(employees.data.Data[0].ItemId);
  }, [employees.data, selectedId]);

  const notify = (text: string, severity: 'success' | 'error' = 'success') =>
    setMessage({text, severity});

  const removeLedger = async (kind: 'work' | 'payment', ItemId: string) => {
    if (!window.confirm('Delete this ledger entry? The audit history will be preserved.')) return;
    try {
      if (kind === 'work') await deleteWork({ItemId}).unwrap();
      else await deletePayment({ItemId}).unwrap();
      notify('Ledger entry deleted.');
    } catch { notify('The entry could not be deleted.', 'error'); }
  };

  const summary = overview.data?.Data.Summary;
  const selected = employees.data?.Data.find(item => item.ItemId === selectedId);

  return (
    <Box sx={{p: {xs: '16px', md: '32px'}, maxWidth: 1500, mx: 'auto'}}>
      <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" gap="20px" mb="32px">
        <Box>
          <Typography variant="h4" fontWeight={800}>Employee management</Typography>
          <Typography color="text.secondary">Work, payments, balances and review requests in one place.</Typography>
        </Box>
        <Button variant="contained" startIcon={<IconPlus />} onClick={() => setEmployeeDialog('new')}>Add employee</Button>
      </Stack>
      {message && <Alert severity={message.severity} onClose={() => setMessage(null)} sx={{mb: '20px'}}>{message.text}</Alert>}

      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '300px minmax(0,1fr)', lg: '320px minmax(0,1fr)'}, gap: '24px'}}>
        <Card variant="outlined" sx={{alignSelf: 'start'}}>
          <Box p="20px"><Typography fontWeight={800}>Team</Typography><Typography variant="caption" color="text.secondary">{employees.data?.TotalCount ?? 0} employees</Typography></Box>
          <Divider />
          {employees.isLoading && <Stack gap="12px" sx={{p: '16px'}} role="status" aria-label="Loading employees">
            {Array.from({length: 6}, (_, index) => <Skeleton key={index} animation="wave" variant="rounded" height={52} />)}
          </Stack>}
          <List disablePadding>
            {employees.data?.Data.map(employee => (
              <ListItemButton key={employee.ItemId} selected={selectedId === employee.ItemId} onClick={() => setSelectedId(employee.ItemId)} sx={{px: '18px', py: '14px', gap: '12px'}}>
                <ListItemText
                  primary={employee.DisplayName}
                  secondary={`${employee.Active ? 'Active' : 'Inactive'} | Balance ${money(employee.Balance)}`}
                />
                <Chip size="small" color={employee.Balance > 0 ? 'warning' : employee.Balance < 0 ? 'info' : 'success'} label={employee.Balance > 0 ? 'Owed' : employee.Balance < 0 ? 'Advance' : 'Settled'} />
              </ListItemButton>
            ))}
          </List>
        </Card>

        <Box minWidth={0}>
          {!selectedId && <Alert severity="info">Add or select an employee to manage their ledger.</Alert>}
          {overview.isFetching && <DetailSkeleton rows={6} />}
          {overview.isError && <Alert severity="error">Employee details could not be loaded.</Alert>}
          {overview.data && summary && (
            <Stack gap="24px">
              <Card variant="outlined" sx={{p: {xs: '20px', md: '24px'}}}>
                <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" gap="20px">
                  <Box>
                    <Stack direction="row" gap="8px" alignItems="center" flexWrap="wrap">
                      <Typography variant="h5" fontWeight={800}>{overview.data.Data.Employee.DisplayName}</Typography>
                      <Chip size="small" label={overview.data.Data.Employee.Active ? 'Active' : 'Inactive'} color={overview.data.Data.Employee.Active ? 'success' : 'default'} />
                    </Stack>
                    <Typography color="text.secondary">{overview.data.Data.Employee.Phone} | {overview.data.Data.Employee.Email}</Typography>
                    <Typography color="text.secondary">{overview.data.Data.Employee.Address}</Typography>
                  </Box>
                  <Stack direction="row" gap="8px" alignItems="flex-start" flexWrap="wrap">
                    {selected && <Button startIcon={<IconEdit />} onClick={() => setEmployeeDialog(selected)}>Edit</Button>}
                    {overview.data.Data.Employee.Active ? <Button color="warning" startIcon={<IconUserOff />} onClick={async () => {
                      if (!window.confirm('Deactivate this employee login? Ledger history will remain.')) return;
                      try { await deactivateEmployee({EmployeeId: selectedId}).unwrap(); notify('Employee deactivated.'); }
                      catch { notify('Employee could not be deactivated.', 'error'); }
                    }}>Deactivate</Button> : <Button color="success" onClick={async () => {
                      try { await updateEmployee({ItemId: selectedId, Active: true}).unwrap(); notify('Employee reactivated.'); }
                      catch { notify('Employee could not be reactivated.', 'error'); }
                    }}>Reactivate</Button>}
                  </Stack>
                </Stack>
              </Card>

              <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(3,1fr)'}, gap: '16px'}}>
                {[
                  ['Earned', summary.TotalEarned, 'primary'],
                  ['Paid', summary.TotalPaid, 'info'],
                  [summary.BalanceDirection === 'business_owes_employee' ? 'We owe employee' : summary.BalanceDirection === 'employee_owes_business' ? 'Employee advance' : 'Settled', Math.abs(summary.Balance), summary.Balance === 0 ? 'success' : 'warning'],
                ].map(([label, value, color]) => (
                  <Card key={String(label)} variant="outlined" sx={{p: '20px', borderTop: 3, borderTopColor: `${color}.main`}}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography variant="h5" fontWeight={800}>{money(Number(value))}</Typography>
                  </Card>
                ))}
              </Box>

              <Card variant="outlined">
                <Tabs value={tab} onChange={(_event, value) => setTab(value)} variant="scrollable" sx={{px: '12px', pt: '8px'}}>
                  <Tab label={`Work (${overview.data.Data.WorkEntries.length})`} />
                  <Tab label={`Payments (${overview.data.Data.PaymentEntries.length})`} />
                  <Tab label={`Review requests (${overview.data.Data.Feedback.length})`} />
                </Tabs>
                <Divider />
                <Box p={{xs: '16px', md: '24px'}}>
                  {tab === 0 && <>
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => setLedgerDialog({kind: 'work'})} sx={{mb: '16px'}}>Add work</Button>
                    <Stack divider={<Divider flexItem />}>
                      {overview.data.Data.WorkEntries.map(entry => <Stack key={entry.ItemId} direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} py="16px" gap="16px">
                        <Box><Typography fontWeight={700}>{entry.Description}</Typography><Typography variant="caption" color="text.secondary">{entry.WorkDate}{entry.BatchId ? ` | Batch ${entry.BatchId}` : ''}</Typography></Box>
                        <Stack direction="row" alignItems="center" gap="4px"><Typography fontWeight={800} mr="8px">{money(entry.Amount)}</Typography><IconButton aria-label="Edit work" onClick={() => setLedgerDialog({kind: 'work', value: entry})}><IconEdit size={18} /></IconButton><IconButton aria-label="Delete work" color="error" onClick={() => removeLedger('work', entry.ItemId)}><IconTrash size={18} /></IconButton></Stack>
                      </Stack>)}
                    </Stack>
                  </>}
                  {tab === 1 && <>
                    <Button variant="contained" startIcon={<IconPlus />} onClick={() => setLedgerDialog({kind: 'payment'})} sx={{mb: '16px'}}>Add payment</Button>
                    <Stack divider={<Divider flexItem />}>
                      {overview.data.Data.PaymentEntries.map(entry => <Stack key={entry.ItemId} direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} py="16px" gap="16px">
                        <Box><Typography fontWeight={700}>{entry.Note || 'Employee payment'}</Typography><Typography variant="caption" color="text.secondary">{entry.PaymentDate}{entry.Reference ? ` | ${entry.Reference}` : ''}</Typography></Box>
                        <Stack direction="row" alignItems="center" gap="4px"><Typography fontWeight={800} mr="8px">{money(entry.Amount)}</Typography><IconButton aria-label="Edit payment" onClick={() => setLedgerDialog({kind: 'payment', value: entry})}><IconEdit size={18} /></IconButton><IconButton aria-label="Delete payment" color="error" onClick={() => removeLedger('payment', entry.ItemId)}><IconTrash size={18} /></IconButton></Stack>
                      </Stack>)}
                    </Stack>
                  </>}
                  {tab === 2 && <Stack gap="16px">
                    {overview.data.Data.Feedback.length === 0 && <Alert severity="info">No review requests.</Alert>}
                    {overview.data.Data.Feedback.map(item => <Card key={item.ItemId} variant="outlined" sx={{p: '20px'}}>
                      <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" gap="16px"><Box><Typography fontWeight={700}>{item.TargetType === 'work' ? 'Work entry' : 'Payment entry'} review</Typography><Typography>{item.Explanation}</Typography>{item.ResolutionNote && <Typography variant="body2" color="text.secondary">Resolution: {item.ResolutionNote}</Typography>}</Box><Chip size="small" label={item.Status} color={item.Status === 'pending' ? 'warning' : item.Status === 'accepted' ? 'success' : 'default'} /></Stack>
                      {item.Status === 'pending' && <Stack direction="row" gap="8px" mt="16px"><Button size="small" variant="contained" color="success" onClick={async () => {
                        const note = window.prompt('Resolution note (required)'); if (!note?.trim()) return;
                        await resolveFeedback({FeedbackId: item.ItemId, Status: 'accepted', ResolutionNote: note}).unwrap(); notify('Feedback accepted. Edit the ledger separately if an amount must change.');
                      }}>Accept</Button><Button size="small" variant="outlined" color="error" onClick={async () => {
                        const note = window.prompt('Reason for declining (required)'); if (!note?.trim()) return;
                        await resolveFeedback({FeedbackId: item.ItemId, Status: 'declined', ResolutionNote: note}).unwrap(); notify('Feedback declined.');
                      }}>Decline</Button></Stack>}
                    </Card>)}
                  </Stack>}
                </Box>
              </Card>
            </Stack>
          )}
        </Box>
      </Box>

      <EmployeeDialog
        value={employeeDialog}
        onClose={() => setEmployeeDialog(null)}
        onSave={async form => {
          try {
            if (employeeDialog === 'new') await createEmployee(form).unwrap();
            else if (employeeDialog) await updateEmployee({ItemId: employeeDialog.ItemId, FirstName: form.FirstName, LastName: form.LastName, DisplayName: form.DisplayName, Phone: form.Phone, Address: form.Address}).unwrap();
            setEmployeeDialog(null); notify(employeeDialog === 'new' ? 'Employee created.' : 'Employee updated.');
          } catch { notify('Employee could not be saved.', 'error'); }
        }}
      />
      <LedgerDialog
        state={ledgerDialog}
        employeeId={selectedId}
        onClose={() => setLedgerDialog(null)}
        onSave={async form => {
          try {
            if (ledgerDialog?.kind === 'work') {
              const payload = {EmployeeId: selectedId, WorkDate: form.date, Description: form.description, Amount: Number(form.amount), BatchId: form.reference || undefined};
              if (ledgerDialog.value) await updateWork({ItemId: ledgerDialog.value.ItemId, ...payload}).unwrap(); else await createWork(payload).unwrap();
            } else if (ledgerDialog?.kind === 'payment') {
              const payload = {EmployeeId: selectedId, PaymentDate: form.date, Amount: Number(form.amount), Note: form.description, Reference: form.reference};
              if (ledgerDialog.value) await updatePayment({ItemId: ledgerDialog.value.ItemId, ...payload}).unwrap(); else await createPayment(payload).unwrap();
            }
            setLedgerDialog(null); notify('Ledger entry saved.');
          } catch { notify('Ledger entry could not be saved. Check the date, amount, and optional batch.', 'error'); }
        }}
      />
    </Box>
  );
}

function EmployeeDialog({value, onClose, onSave}: {value: IEmployeeSummary | 'new' | null; onClose: () => void; onSave: (value: EmployeeForm) => Promise<void>}) {
  const employee = value && value !== 'new' ? value : null;
  const [form, setForm] = useState<EmployeeForm>({FirstName: '', LastName: '', DisplayName: '', Email: '', Phone: '', Address: '', Password: ''});
  useEffect(() => setForm(employee ? {...employee, Password: ''} : {FirstName: '', LastName: '', DisplayName: '', Email: '', Phone: '', Address: '', Password: ''}), [employee, value]);
  return <Dialog open={Boolean(value)} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{value === 'new' ? 'Add employee' : 'Edit employee'}</DialogTitle><DialogContent><Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr'}, columnGap: '16px', rowGap: '20px', mt: '8px'}}>
    {(['FirstName', 'LastName', 'DisplayName', 'Email', 'Phone', 'Address', ...(value === 'new' ? ['Password'] : [])] as Array<keyof EmployeeForm>).map(field => <TextField key={field} label={field.replace(/([A-Z])/g, ' $1').trim()} type={field === 'Password' ? 'password' : 'text'} value={form[field] ?? ''} disabled={field === 'Email' && value !== 'new'} onChange={event => setForm({...form, [field]: event.target.value})} required={field !== 'DisplayName'} sx={field === 'Address' ? {gridColumn: '1 / -1'} : undefined} />)}
  </Box></DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={() => onSave(form)} disabled={!form.FirstName || !form.LastName || !form.Email || !form.Phone || !form.Address || (value === 'new' && !form.Password)}>Save</Button></DialogActions></Dialog>;
}

export function LedgerDialog({state, employeeId, onClose, onSave}: {state: LedgerDialogState; employeeId: string; onClose: () => void; onSave: (value: {date: string; amount: string; description: string; reference: string}) => Promise<void>}) {
  const value = state?.value;
  const [form, setForm] = useState({date: today(), amount: '', description: '', reference: ''});
  const [batchSearch, setBatchSearch] = useState('');
  const [debouncedBatchSearch, setDebouncedBatchSearch] = useState('');
  const batchOptions = useListEmployeeBatchesQuery(
    {EmployeeId: employeeId, SearchTerm: debouncedBatchSearch, Page: 1, Size: 20},
    {skip: state?.kind !== 'work' || !employeeId},
  );
  useEffect(() => {
    if (state?.kind === 'work') {
      setForm({date: value?.WorkDate ?? today(), amount: value?.Amount?.toString() ?? '', description: value?.Description ?? '', reference: value?.BatchId ?? ''});
      setBatchSearch(value?.BatchId ?? '');
    }
    if (state?.kind === 'payment') setForm({date: value?.PaymentDate ?? today(), amount: value?.Amount?.toString() ?? '', description: value?.Note ?? '', reference: value?.Reference ?? ''});
  }, [state, value]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedBatchSearch(batchSearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [batchSearch]);
  const availableBatches = batchOptions.data?.Data ?? [];
  const selectedBatch = availableBatches.find(batch => batch.BatchId === form.reference) ?? null;
  return <Dialog open={Boolean(state)} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{value ? 'Edit' : 'Add'} {state?.kind === 'work' ? 'work entry' : 'payment'}</DialogTitle><DialogContent><Stack gap="20px" mt="8px">
    <TextField label="Date" type="date" value={form.date} onChange={event => setForm({...form, date: event.target.value})} InputLabelProps={{shrink: true}} required />
    <TextField label="Amount (Tk)" type="number" inputProps={{min: 0.01, step: 0.01}} value={form.amount} onChange={event => setForm({...form, amount: event.target.value})} required />
    <TextField label={state?.kind === 'work' ? 'Work description' : 'Payment note'} value={form.description} onChange={event => setForm({...form, description: event.target.value})} required={state?.kind === 'work'} multiline rows={2} />
    {state?.kind === 'work' ? (
      <Autocomplete<IEmployeeBatchOption>
        options={availableBatches}
        value={selectedBatch}
        loading={batchOptions.isFetching}
        openOnFocus
        filterOptions={options => options}
        getOptionLabel={option => `${option.ProductName} - ${option.BatchId}`}
        isOptionEqualToValue={(option, selected) => option.BatchId === selected.BatchId}
        onInputChange={(_event, input, reason) => {
          if (reason === 'input') setBatchSearch(input);
          if (reason === 'clear') setBatchSearch('');
        }}
        onChange={(_event, selected) => setForm({...form, reference: selected?.BatchId ?? ''})}
        noOptionsText={batchSearch ? 'No attributed batches match your search.' : 'No batches are attributed to this employee.'}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.BatchId} sx={{display: 'block !important'}}>
            <Typography fontWeight={700}>{option.ProductName}</Typography>
            <Typography variant="caption" fontFamily="monospace" sx={{overflowWrap: 'anywhere'}}>{option.BatchId}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {option.Category} / {option.SubCategory} - {option.QuantityReceived} units
            </Typography>
          </Box>
        )}
        renderInput={params => (
          <TextField
            {...params}
            label="Related production batch (optional)"
            helperText="Search by product name or batch ID. Only batches attributed to this employee are shown."
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{batchOptions.isFetching ? <CircularProgress color="inherit" size={18} /> : null}{params.InputProps.endAdornment}</>,
            }}
          />
        )}
      />
    ) : (
      <TextField label="Reference (optional)" value={form.reference} onChange={event => setForm({...form, reference: event.target.value})} />
    )}
  </Stack></DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={() => onSave(form)} disabled={!form.date || Number(form.amount) <= 0 || (state?.kind === 'work' && !form.description.trim())}>Save</Button></DialogActions></Dialog>;
}
