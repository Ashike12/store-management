import {Box, Button, Typography} from '@mui/material';
import {alpha, useTheme} from '@mui/material/styles';
import {IconDatabaseOff, type Icon} from '@tabler/icons-react';

export interface EmptyTableStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: Icon;
}

export default function EmptyTableState({
  title = 'Nothing to show yet',
  description = 'New records will appear here as soon as they are added.',
  actionLabel,
  onAction,
  icon: StateIcon = IconDatabaseOff,
}: Readonly<EmptyTableStateProps>) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Box
      role="status"
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: 280,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        px: '24px',
        py: '48px',
        textAlign: 'center',
        background: `radial-gradient(circle at 50% 35%, ${alpha(primary, 0.12)}, transparent 42%)`,
      }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          width: 220,
          height: 220,
          border: `1px dashed ${alpha(primary, 0.22)}`,
          borderRadius: '50%',
          animation: 'empty-state-orbit 18s linear infinite',
          '@keyframes empty-state-orbit': {to: {transform: 'rotate(360deg)'}},
          '@media (prefers-reduced-motion: reduce)': {animation: 'none'},
        }}
      />
      <Box sx={{position: 'relative', maxWidth: 430}}>
        <Box
          sx={{
            display: 'inline-flex',
            width: 72,
            height: 72,
            alignItems: 'center',
            justifyContent: 'center',
            mb: '20px',
            border: `1px solid ${alpha(primary, 0.3)}`,
            borderRadius: '22px',
            color: primary,
            background: `linear-gradient(145deg, ${alpha(primary, 0.18)}, ${alpha(primary, 0.04)})`,
            boxShadow: `0 18px 45px ${alpha(primary, 0.16)}`,
            transform: 'rotate(-4deg)',
          }}>
          <StateIcon size={34} stroke={1.6} />
        </Box>
        <Typography variant="h6" fontWeight={800} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{mt: '8px', lineHeight: 1.7}}>
          {description}
        </Typography>
        {actionLabel && onAction && (
          <Button variant="contained" onClick={onAction} sx={{mt: '24px', borderRadius: '10px'}}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
