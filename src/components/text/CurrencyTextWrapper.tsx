import {type VariantProps} from 'class-variance-authority';
import cn from '@core/utils/cn';
import {textVariants} from './TextWrapper';
import {convertCurrencyTypeUIValue} from '@core/utils/textUtils';

export interface ITextWrapperProps extends VariantProps<typeof textVariants> {
  content: number | null;
  className?: string;
  currency?: string | null;
  currencyPosition?: 'left' | 'right';
}

export default function CurrencyTextWrapper({
  className,
  variant,
  content,
  currency = null,
  currencyPosition = 'left',
}: Readonly<ITextWrapperProps>) {
  const uiValue = convertCurrencyTypeUIValue(
    content,
    currency,
    currencyPosition,
  );
  return (
    <span className={cn(textVariants({variant, className}))}>{uiValue}</span>
  );
}
