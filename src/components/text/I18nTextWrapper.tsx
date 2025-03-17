import {type VariantProps} from 'class-variance-authority';
import cn from '@core/utils/cn';
import {textVariants} from './TextWrapper';
import {useAppSelector} from '@core/store/hooks';
import {selectTranslation} from '@core/store/slices/language.slice';

export interface ITextWrapperProps extends VariantProps<typeof textVariants> {
  content: string;
  className?: string;
}

export default function I18nTextWrapper({
  className,
  variant,
  content,
}: Readonly<ITextWrapperProps>) {
  const uiValue = useAppSelector(selectTranslation(content));
  return (
    <span className={cn(textVariants({variant, className}))}>{uiValue}</span>
  );
}
