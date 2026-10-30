import {
  Alert,
  Box,
  Button,
  Chip,
  Skeleton,
  Divider,
  Drawer,
  IconButton,
  Pagination,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {alpha, useTheme} from '@mui/material/styles';
import {IconCopy, IconPackage, IconRefresh, IconUsers, IconX} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {IProduct, IProductBatch} from '@core/interfaces/api/IProduct';
import {
  useListBatchItemsQuery,
  useListProductBatchesQuery,
} from '@core/store/api/product';

const PAGE_SIZE = 10;

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('en-BD', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : 'Unknown';

const InventoryTraceability = ({
  product,
  onClose,
}: {
  product: IProduct | null;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [batchPage, setBatchPage] = useState(1);
  const [itemPage, setItemPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<IProductBatch | null>(
    null,
  );
  const [copyFeedback, setCopyFeedback] = useState<{
    message: string;
    severity: 'success' | 'error';
  } | null>(null);

  const batches = useListProductBatchesQuery(
    {ProductId: product?.ItemId ?? '', Page: batchPage, Size: PAGE_SIZE},
    {skip: !product},
  );
  const items = useListBatchItemsQuery(
    {BatchId: selectedBatch?.BatchId ?? '', Page: itemPage, Size: PAGE_SIZE},
    {skip: !selectedBatch},
  );

  useEffect(() => {
    setBatchPage(1);
    setItemPage(1);
    setSelectedBatch(null);
  }, [product?.ItemId]);

  useEffect(() => {
    const firstBatch = batches.currentData?.Data?.[0];
    if (firstBatch && !selectedBatch) {
      setSelectedBatch(firstBatch);
    }
  }, [batches.currentData, selectedBatch]);

  const selectBatch = (batch: IProductBatch) => {
    setSelectedBatch(batch);
    setItemPage(1);
  };

  const copySerial = async (serial: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable');
      }
      await navigator.clipboard.writeText(serial);
      setCopyFeedback({
        message: `Serial ${serial} copied`,
        severity: 'success',
      });
    } catch {
      setCopyFeedback({
        message: 'Could not copy the serial number. Please copy it manually.',
        severity: 'error',
      });
    }
  };

  const copyBatchId = async (batchId: string) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable');
      }
      await navigator.clipboard.writeText(batchId);
      setCopyFeedback({message: `Batch ID ${batchId} copied`, severity: 'success'});
    } catch {
      setCopyFeedback({
        message: 'Could not copy the batch ID. Please copy it manually.',
        severity: 'error',
      });
    }
  };

  const batchCount = Math.max(
    1,
    Math.ceil((batches.currentData?.TotalCount ?? 0) / PAGE_SIZE),
  );
  const itemCount = Math.max(
    1,
    Math.ceil((items.currentData?.TotalCount ?? 0) / PAGE_SIZE),
  );

  return (
    <Drawer
      anchor="right"
      open={Boolean(product)}
      onClose={onClose}
      PaperProps={{
        'aria-label': 'Inventory traceability',
        sx: {
          width: fullScreen ? '100%' : 980,
          maxWidth: '100%',
          backgroundImage: 'none',
        },
      }}>
      {product && (
        <Box sx={{display: 'flex', height: '100%', minHeight: 0, flexDirection: 'column'}}>
          <Box sx={{px: {xs: '16px', sm: '24px'}, py: {xs: '16px', sm: '20px'}, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, transparent 58%)`}}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={2}>
              <Box minWidth={0}>
                <Typography variant="overline" color="text.secondary">
                  Inventory traceability
                </Typography>
                <Typography variant="h5" component="h2" fontWeight={800}>
                  {product.ProductName}
                </Typography>
                <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                  <Chip size="small" label={product.Category} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={product.SubCategory}
                  />
                  <Chip
                    size="small"
                    color="info"
                    icon={<IconPackage size={15} />}
                    label={`${product.Quantity} in catalog stock`}
                  />
                </Stack>
              </Box>
              <IconButton
                aria-label="Close inventory traceability"
                onClick={onClose}>
                <IconX />
              </IconButton>
            </Stack>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'grid',
              flex: 1,
              gridTemplateColumns: {xs: '1fr', md: '340px minmax(0, 1fr)'},
              minHeight: 0,
              overflow: {xs: 'auto', md: 'hidden'},
            }}>
            <Box
              sx={{
                borderRight: {md: `1px solid ${theme.palette.divider}`},
                borderBottom: {xs: `1px solid ${theme.palette.divider}`, md: 0},
                bgcolor: alpha(theme.palette.background.default, 0.42),
                minHeight: 0,
                overflowY: {md: 'auto'},
                p: {xs: '16px', sm: '20px'},
              }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1.5}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Batches
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Immutable intake history
                  </Typography>
                </Box>
                <Tooltip title="Reload batches">
                  <span>
                    <IconButton
                      aria-label="Reload batches"
                      disabled={batches.isFetching}
                      onClick={() => batches.refetch()}>
                      <IconRefresh size={18} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>

              {batches.isFetching && !batches.currentData && (
                <Stack gap="10px" role="status" aria-label="Loading batches">
                  {Array.from({length: 5}, (_, index) => <Skeleton key={index} animation="wave" variant="rounded" height={78} />)}
                </Stack>
              )}
              {batches.isError && (
                <Alert
                  severity="error"
                  action={
                    <Button onClick={() => batches.refetch()}>Retry</Button>
                  }>
                  Batch history could not be loaded.
                </Alert>
              )}
              {!batches.isFetching &&
                !batches.isError &&
                batches.currentData?.Data.length === 0 && (
                  <Alert severity="info">
                    No inventory batches exist for this product yet.
                  </Alert>
                )}
              <Stack gap="12px" role="list" aria-label="Product batches">
                {batches.currentData?.Data.map(batch => {
                  const selected = selectedBatch?.BatchId === batch.BatchId;
                  return (
                    <Box key={batch.BatchId} position="relative">
                      <Button
                        role="listitem"
                        aria-label={`Select batch ${batch.BatchId}`}
                        aria-pressed={selected}
                        onClick={() => selectBatch(batch)}
                        variant="outlined"
                        fullWidth
                        sx={{
                          justifyContent: 'flex-start',
                          borderColor: selected ? 'primary.main' : 'divider',
                          borderRadius: '14px',
                          bgcolor: selected ? alpha(theme.palette.primary.main, 0.12) : 'background.paper',
                          color: 'text.primary',
                          p: '14px',
                          textAlign: 'left',
                          textTransform: 'none',
                          boxShadow: selected ? `0 10px 28px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}>
                        <Box minWidth={0} width="100%">
                          <Typography variant="overline" color="text.secondary" lineHeight={1}>
                            Batch ID
                          </Typography>
                          <Typography
                            fontFamily="monospace"
                            fontSize={12}
                            fontWeight={800}
                            sx={{overflowWrap: 'anywhere', pr: '34px', mt: '4px'}}>
                            {batch.BatchId}
                          </Typography>
                          <Stack direction="row" gap="6px" flexWrap="wrap" mt="10px">
                            <Chip size="small" color="primary" variant="outlined" label={`+${batch.QuantityReceived} received`} />
                            <Chip size="small" variant="outlined" label={formatDate(batch.CreatedDate)} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" display="block" mt="8px" noWrap>
                            Added by {batch.CreatedBy || 'Unknown admin'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap>
                            Maker: {batch.MakerName || 'Not assigned'}
                          </Typography>
                        </Box>
                      </Button>
                      <Tooltip title="Copy batch ID for employee work">
                        <IconButton
                          aria-label={`Copy batch ID ${batch.BatchId}`}
                          size="small"
                          onClick={() => copyBatchId(batch.BatchId)}
                          sx={{position: 'absolute', top: '9px', right: '9px', color: 'primary.main'}}>
                          <IconCopy size={17} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Stack>
              {(batches.currentData?.TotalCount ?? 0) > PAGE_SIZE && (
                <Pagination
                  aria-label="Batch pages"
                  count={batchCount}
                  page={batchPage}
                  onChange={(_event, page) => {
                    setBatchPage(page);
                    setSelectedBatch(null);
                    setItemPage(1);
                  }}
                  size="small"
                  sx={{mt: '20px', display: 'flex', justifyContent: 'center'}}
                />
              )}
            </Box>

            <Box sx={{p: {xs: '16px', sm: '24px'}, minWidth: 0, minHeight: 0, overflowY: {md: 'auto'}}}>
              <Typography variant="subtitle1" fontWeight={700}>
                Serialized items
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                component="p"
                mb={2}>
                Admin-only unit identifiers for the selected batch
              </Typography>

              {selectedBatch && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: {xs: 'flex-start', sm: 'center'},
                    justifyContent: 'space-between',
                    flexDirection: {xs: 'column', sm: 'row'},
                    gap: '14px',
                    mb: '20px',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: '16px',
                    bgcolor: alpha(theme.palette.primary.main, 0.07),
                    p: '16px',
                  }}>
                  <Box minWidth={0}>
                    <Stack direction="row" alignItems="center" gap="8px" mb="5px">
                      <IconUsers size={18} color={theme.palette.primary.main} />
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        USE THIS ID FOR EMPLOYEE WORK
                      </Typography>
                    </Stack>
                    <Typography
                      fontFamily="monospace"
                      fontSize={13}
                      fontWeight={800}
                      sx={{overflowWrap: 'anywhere'}}>
                      {selectedBatch.BatchId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Do not include the unit suffix shown in the serial numbers below.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<IconCopy size={16} />}
                    onClick={() => copyBatchId(selectedBatch.BatchId)}
                    sx={{flexShrink: 0}}>
                    Copy batch ID
                  </Button>
                </Box>
              )}

              {!selectedBatch && !batches.isFetching && (
                <Alert severity="info">
                  Select a batch to inspect its serial numbers.
                </Alert>
              )}
              {items.isFetching && selectedBatch && (
                <Stack gap="12px" role="status" aria-label="Loading serial items">
                  {Array.from({length: 7}, (_, index) => <Skeleton key={index} animation="wave" variant="rounded" height={48} />)}
                </Stack>
              )}
              {items.isError && selectedBatch && (
                <Alert
                  severity="error"
                  action={
                    <Button onClick={() => items.refetch()}>Retry</Button>
                  }>
                  Serial items could not be loaded.
                </Alert>
              )}
              {!items.isFetching &&
                !items.isError &&
                selectedBatch &&
                items.currentData?.Data.length === 0 && (
                  <Alert severity="info">
                    This batch has no serialized items.
                  </Alert>
                )}
              <Stack gap="10px">
                {items.currentData?.Data.map(item => (
                  <Stack
                    key={item.SerialNumber}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="12px"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: '12px',
                      bgcolor: 'background.paper',
                      px: '14px',
                      py: '12px',
                    }}>
                    <Box minWidth={0}>
                      <Typography variant="caption" color="primary.main" fontWeight={800}>
                        UNIT {item.UnitIndex}
                      </Typography>
                      <Typography
                        fontFamily="monospace"
                        fontSize={13}
                        fontWeight={700}
                        title={item.SerialNumber}
                        sx={{overflowWrap: 'anywhere'}}>
                        {item.SerialNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created {formatDate(item.CreatedDate)}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy serial number">
                      <IconButton
                        aria-label={`Copy serial ${item.SerialNumber}`}
                        onClick={() => copySerial(item.SerialNumber)}>
                        <IconCopy size={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>
              {(items.currentData?.TotalCount ?? 0) > PAGE_SIZE && (
                <Pagination
                  aria-label="Serial item pages"
                  count={itemCount}
                  page={itemPage}
                  onChange={(_event, page) => setItemPage(page)}
                  sx={{mt: '20px', display: 'flex', justifyContent: 'center'}}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        open={Boolean(copyFeedback)}
        autoHideDuration={3200}
        onClose={() => setCopyFeedback(null)}>
        <Alert
          severity={copyFeedback?.severity ?? 'success'}
          role={copyFeedback?.severity === 'error' ? 'alert' : 'status'}
          variant="filled">
          {copyFeedback?.message}
        </Alert>
      </Snackbar>
    </Drawer>
  );
};

export default InventoryTraceability;
