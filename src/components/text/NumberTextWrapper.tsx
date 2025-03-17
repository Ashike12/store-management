import {type VariantProps} from 'class-variance-authority';
import cn from '@core/utils/cn';
import {textVariants} from './TextWrapper';
import {convertNumberTypeUIValue} from '@core/utils/textUtils';

export interface ITextWrapperProps extends VariantProps<typeof textVariants> {
  content: number | null;
  className?: string;
}

export default function NumberTextWrapper({
  className,
  variant,
  content,
}: Readonly<ITextWrapperProps>) {
  const uiValue = convertNumberTypeUIValue(content);
  return (
    <span className={cn(textVariants({variant, className}))}>{uiValue}</span>
  );
}
