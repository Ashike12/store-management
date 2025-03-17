import {cva, VariantProps} from 'class-variance-authority';
import {Icon, IconLoader2, IconProps} from '@tabler/icons-react';
import React, {ForwardRefExoticComponent, RefAttributes} from 'react';
import cn from '@core/utils/cn';
import useLocalization from '@core/hooks/useLocalization';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-[13px] font-sfPro font-[590] leading-[24px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-interaction-main text-common-white hover:bg-interaction-dark disabled:bg-button-disabled disabled:text-text-disabled',
        secondary:
          'bg-interaction-secondary-main text-common-white hover:bg-interaction-secondary disabled:bg-button-disabled disabled:text-text-disabled',
        outline:
          'border border-interaction-main bg-common-white text-interaction-main hover:bg-transparent-interaction-16 disabled:border-button-disabled disabled:text-button-disabled',
        ghost:
          'text-interaction-main bg-transparent hover:bg-transparent-interaction-16 disabled:text-button-disabled',
      },
      size: {
        lg: 'h-[44px] px-[12px] py-[10px]',
        md: 'h-[36px] px-[12px] py-[6px]',
        sm: 'h-[30px] px-[12px] py-[6px] text-[12px] leading-[22px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);

interface ICustomButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  text: string;
  loading?: boolean;
  iconAlign?: 'left' | 'right';
  Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

const CustomButton = React.forwardRef<HTMLButtonElement, ICustomButtonProps>(
  (
    {
      className,
      variant,
      size,
      text,
      Icon,
      loading = false,
      iconAlign = 'right',
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const translatedText = useLocalization({content: text});

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({variant, size, className}))}
        disabled={loading || disabled}
        {...props}>
        {loading && <IconLoader2 className="animate-spin" />}
        {Icon && iconAlign === 'left' && <Icon />}
        {translatedText}
        {Icon && iconAlign === 'right' && <Icon />}
      </button>
    );
  },
);
CustomButton.displayName = 'CustomButton';

export {CustomButton};
