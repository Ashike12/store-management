import { IconSparkles } from '@tabler/icons-react';
import { IconButton, Tooltip } from '@mui/material';

interface AiSuggestionButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export default function AiSuggestionButton({
  onClick,
  loading = false,
  disabled = false,
  tooltip = 'Get AI suggestion',
}: AiSuggestionButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled || loading}
          sx={(theme) => ({
            width: 34,
            height: 34,
            borderRadius: '8px',
            color: theme.vars.palette.primary.contrastText,
            bgcolor: theme.vars.palette.primary.main,
            '&:hover': {
              bgcolor: theme.vars.palette.primary.dark,
            },
            '&.Mui-disabled': {
              color: theme.vars.palette.text.disabled,
              bgcolor: theme.vars.palette.action.disabledBackground,
            },
          })}
        >
          <IconSparkles size={18} className={loading ? 'animate-spin' : ''} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
