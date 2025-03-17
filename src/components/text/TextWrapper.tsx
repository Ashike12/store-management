import {cva, type VariantProps} from 'class-variance-authority';
import useLocalization from '@core/hooks/useLocalization';
import cn from '@core/utils/cn';

const textVariants = cva('font-sfPro inline', {
  variants: {
    variant: {
      H1: 'font-[590] text-[64px] leading-[80px]',
      H2: 'font-[590] text-[48px] leading-[64px]',
      H3: 'font-[590] text-[32px] leading-[48px]',
      H4Medium: 'font-[510] text-[24px] leading-[28.8px]',
      H4Semibold: 'font-[590] text-[24px] leading-[28.8px]',
      H4Bold: 'font-[700] text-[24px] leading-[20.0px]',
      H5: 'font-[590] text-[20px] leading-[30px]',
      H6: 'font-[590] text-[18px] leading-[20px]',
      Subtitle1: 'font-[510] text-[16px] leading-[20px]',
      Subtitle2: 'font-[510] text-[14px] leading-[21px]',
      Subtitle1Bold: 'font-[700] text-[16px] leading-[24px]',
      Subtitle2Bold: 'font-[700] text-[14px] leading-[21px]',
      Body1: 'font-[400] text-[15px] leading-[24px]',
      Body2: 'font-[400] text-[14px] leading-[22px]',
      Body2Medium: 'font-[510] text-[14px] leading-[22px]',
      Caption: 'font-[400] text-[12px] leading-[18px]',
      Overline: 'font-[700] text-[12px] leading-[18px]',
      CaptionSemiBold: 'font-[590] text-[12px] leading-[18px]',
      Label: 'font-[700] text-[12px] leading-[20px]',
      TextFieldLabel: 'font-[400] text-[12px] leading-[12px]',
      ButtonSmall: 'font-[590] text-[12px] leading-[22px]',
      ButtonMedium: 'font-[590] text-[13px] leading-[24px]',
      ButtonLarge: 'font-[590] text-[14px] leading-[26px]',
      ChartLegend: 'font-[400] text-[13px] leading-[24px]',
      TableHeader: 'font-[400] text-[13px] leading-[24px]',
    },
  },
  defaultVariants: {
    variant: 'Body1',
  },
});

export type textVariantType = typeof textVariants;

export interface ITextWrapperProps extends VariantProps<typeof textVariants> {
  content: string | number;
  className?: string;
}

export default function TextWrapper({
  className,
  variant,
  content,
}: Readonly<ITextWrapperProps>) {
  const text = useLocalization({content});
  return <div className={cn(textVariants({variant, className}))}>{text}</div>;
}
