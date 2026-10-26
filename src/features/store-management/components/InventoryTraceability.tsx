import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import {useTheme} from '@mui/material/styles';
import {IconCopy, IconPackage, IconRefresh, IconX} from '@tabler/icons-react';
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
        sx: {width: fullScreen ? '100%' : 760, maxWidth: '100%'},
      }}>
      {product && (
        <Box sx={{display: 'flex', minHeight: '100%', flexDirection: 'column'}}>
          <Box sx={{p: {xs: 2, sm: 3}}}>
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={2}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Inventory traceability
                </Typography>
                <Typography variant="h5" component="h2">
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
              gridTemplateColumns: {xs: '1fr', md: '280px minmax(0, 1fr)'},
              minHeight: 0,
            }}>
            <Box
              sx={{
                borderRight: {md: `1px solid ${theme.palette.divider}`},
                p: 2,
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
                <CircularProgress size={24} aria-label="Loading batches" />
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
              <Stack gap={1} role="list" aria-label="Product batches">
                {batches.currentData?.Data.map(batch => {
                  const selected = selectedBatch?.BatchId === batch.BatchId;
                  return (
                    <Button
                      key={batch.BatchId}
                      role="listitem"
                      aria-label={`Select batch ${batch.BatchId}`}
                      aria-pressed={selected}
                      onClick={() => selectBatch(batch)}
                      variant={selected ? 'contained' : 'outlined'}
                      sx={{
                        justifyContent: 'flex-start',
                        p: 1.25,
                        textAlign: 'left',
                        textTransform: 'none',
                      }}>
                      <Box minWidth={0} width="100%">
                        <Typography
                          noWrap
                          fontFamily="monospace"
                          fontSize={13}
                          fontWeight={700}>
                          {batch.BatchId}
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          +{batch.QuantityReceived} received
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{opacity: 0.8}}>
                          {formatDate(batch.CreatedDate)}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          noWrap
                          sx={{opacity: 0.8}}>
                          By {batch.CreatedBy || 'Unknown admin'}
                        </Typography>
                      </Box>
                    </Button>
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
                  sx={{mt: 2}}
                />
              )}
            </Box>

            <Box sx={{p: 2, minWidth: 0}}>
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

              {!selectedBatch && !batches.isFetching && (
                <Alert severity="info">
                  Select a batch to inspect its serial numbers.
                </Alert>
              )}
              {items.isFetching && selectedBatch && (
                <CircularProgress size={24} aria-label="Loading serial items" />
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
              <Stack divider={<Divider flexItem />}>
                {items.currentData?.Data.map(item => (
                  <Stack
                    key={item.SerialNumber}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    py={1.25}>
                    <Box minWidth={0}>
                      <Typography
                        fontFamily="monospace"
                        fontWeight={700}
                        noWrap
                        title={item.SerialNumber}>
                        {item.SerialNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Unit {item.UnitIndex} · {formatDate(item.CreatedDate)}
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
                  sx={{mt: 2}}
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
