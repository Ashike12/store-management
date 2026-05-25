import {Button} from '@mui/material';
import {Icon, IconLoader2, IconProps} from '@tabler/icons-react';
import React, {ForwardRefExoticComponent, RefAttributes} from 'react';
import {SxProps, Theme} from '@mui/material/styles';
import cn from '@core/utils/cn';
import useLocalization from '@core/hooks/useLocalization';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'lg' | 'md' | 'sm' | 'icon';

interface ICustomButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconAlign?: 'left' | 'right';
  Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  sx?: SxProps<Theme>;
}

function getVariantStyles(theme: Theme, variant: ButtonVariant) {
  const commonStyles = {
    textTransform: 'none',
    borderRadius: '8px',
    fontFamily: 'SF Pro',
    fontWeight: 590,
  };

  if (variant === 'secondary') {
    return {
      ...commonStyles,
      bgcolor: theme.vars.palette.background.neutral,
      color: theme.vars.palette.text.primary,
      '&:hover': {bgcolor: theme.vars.palette.action.hover},
      '&.Mui-disabled': {
        bgcolor: theme.vars.palette.action.disabledBackground,
        color: theme.vars.palette.text.disabled,
      },
    };
  }

  if (variant === 'outline') {
    return {
      ...commonStyles,
      border: `1px solid ${theme.vars.palette.primary.main}`,
      bgcolor: 'transparent',
      color: theme.vars.palette.primary.main,
      '&:hover': {bgcolor: theme.vars.palette.action.hover},
      '&.Mui-disabled': {
        borderColor: theme.vars.palette.action.disabledBackground,
        color: theme.vars.palette.text.disabled,
      },
    };
  }

  if (variant === 'ghost') {
    return {
      ...commonStyles,
      bgcolor: 'transparent',
      color: theme.vars.palette.primary.main,
      '&:hover': {bgcolor: theme.vars.palette.action.hover},
      '&.Mui-disabled': {
        color: theme.vars.palette.text.disabled,
      },
    };
  }

  return {
    ...commonStyles,
    bgcolor: theme.vars.palette.primary.main,
    color: theme.vars.palette.primary.contrastText,
    '&:hover': {bgcolor: theme.vars.palette.primary.dark},
    '&.Mui-disabled': {
      bgcolor: theme.vars.palette.action.disabledBackground,
      color: theme.vars.palette.text.disabled,
    },
  };
}

const sizeStyles: Record<ButtonSize, object> = {
  lg: {height: '44px', px: '12px', py: '10px', fontSize: '13px', lineHeight: '24px'},
  md: {height: '36px', px: '12px', py: '6px', fontSize: '13px', lineHeight: '24px'},
  sm: {height: '30px', px: '12px', py: '6px', fontSize: '12px', lineHeight: '22px'},
  icon: {height: '40px', width: '40px', minWidth: '40px'},
};

const CustomButton = React.forwardRef<HTMLButtonElement, ICustomButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'lg',
      text,
      Icon,
      loading = false,
      iconAlign = 'right',
      disabled = false,
      sx,
      ...props
    },
    ref,
  ) => {
    const translatedText = useLocalization({content: text});

    return (
      <Button
        ref={ref}
        className={cn(className)}
        disabled={loading || disabled}
        sx={theme => {
          const baseStyles = {
            ...sizeStyles[size],
            ...getVariantStyles(theme, variant),
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
          };

          if (Array.isArray(sx)) {
            return [baseStyles, ...sx];
          }

          if (typeof sx === 'function') {
            return [baseStyles, sx(theme)];
          }

          return sx ? [baseStyles, sx] : baseStyles;
        }}
        {...props}>
        {loading && <IconLoader2 className="animate-spin" />}
        {Icon && iconAlign === 'left' && <Icon />}
        {translatedText}
        {Icon && iconAlign === 'right' && <Icon />}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';

export {CustomButton};
