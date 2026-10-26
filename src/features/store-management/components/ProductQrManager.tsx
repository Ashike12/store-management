import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconRefresh,
  IconX,
} from '@tabler/icons-react';
import {useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {IProduct, ProductQrAction} from '@core/interfaces/api/IProduct';
import {useConfigureProductQrMutation} from '@core/store/api/product';

interface ProductQrManagerProps {
  product: IProduct | null;
  onClose: () => void;
  onUpdated: () => void;
}

const ProductQrManager = ({
  product,
  onClose,
  onUpdated,
}: ProductQrManagerProps) => {
  const [configureQr, {isLoading}] = useConfigureProductQrMutation();
  const [enabled, setEnabled] = useState(
    Boolean(product?.QrVerificationEnabled),
  );
  const [verificationUrl, setVerificationUrl] = useState(
    product?.QrVerificationUrl ?? null,
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const configure = async (action: ProductQrAction) => {
    setError('');
    try {
      const response = await configureQr({
        ItemId: product.ItemId,
        Action: action,
      }).unwrap();
      setEnabled(response.Data.QrVerificationEnabled);
      setVerificationUrl(response.Data.QrVerificationUrl);
      onUpdated();
    } catch {
      setError('The QR setting could not be updated. Please try again.');
    }
  };

  const copyUrl = async () => {
    if (!verificationUrl) return;
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('The verification link could not be copied.');
    }
  };

  const downloadQr = () => {
    const svg = document.getElementById('product-qr-preview');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${product.ProductName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-qr.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={isLoading ? undefined : onClose}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Product QR label
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.ProductName}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close QR manager"
          onClick={onClose}
          disabled={isLoading}>
          <IconX size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} alignItems="center">
          {error && (
            <Alert severity="error" sx={{width: '100%'}}>
              {error}
            </Alert>
          )}
          <Chip
            icon={enabled ? <IconCheck size={16} /> : <IconX size={16} />}
            color={enabled ? 'success' : 'default'}
            label={enabled ? 'Verification enabled' : 'Verification disabled'}
          />

          {enabled && verificationUrl ? (
            <>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                }}>
                <QRCodeSVG
                  id="product-qr-preview"
                  value={verificationUrl}
                  size={220}
                  level="H"
                  marginSize={2}
                  title={`Verify ${product.ProductName}`}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center">
                This label identifies the catalog product. It is not proof of
                authenticity or purchase.
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  overflowWrap: 'anywhere',
                }}>
                <Typography variant="body2">{verificationUrl}</Typography>
              </Box>
              <Stack
                direction={{xs: 'column', sm: 'row'}}
                spacing={1}
                width="100%">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<IconCopy size={18} />}
                  onClick={copyUrl}>
                  {copied ? 'Copied' : 'Copy link'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<IconDownload size={18} />}
                  onClick={downloadQr}>
                  Download SVG
                </Button>
              </Stack>
            </>
          ) : enabled ? (
            <Alert severity="warning" sx={{width: '100%'}}>
              QR is enabled, but no public URL was generated. Set
              `PUBLIC_CLIENT_URL` in the backend environment and rotate this QR.
            </Alert>
          ) : (
            <Alert severity="info" sx={{width: '100%'}}>
              Enable QR verification only for products that will receive a
              physical label.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{p: 2, gap: 1, flexWrap: 'wrap'}}>
        {enabled ? (
          <>
            <Button
              color="error"
              disabled={isLoading}
              onClick={() => configure('disable')}>
              Disable
            </Button>
            <Tooltip title="The current printed QR will stop working immediately">
              <span>
                <Button
                  variant="outlined"
                  disabled={isLoading}
                  startIcon={<IconRefresh size={18} />}
                  onClick={() => configure('rotate')}>
                  Rotate code
                </Button>
              </span>
            </Tooltip>
          </>
        ) : (
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={() => configure('enable')}>
            Enable QR verification
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductQrManager;
