import TextWrapper from '@components/text/TextWrapper';
import cn from '@core/utils/cn';

interface ITableChipProps {
  value: string;
  className?: string;
}

export default function TableChip({
  value,
  className,
}: Readonly<ITableChipProps>) {
  return (
    <div
      className={cn(
        'bg-transparent-warning-16 text-warning-dark flex max-w-fit items-center rounded-[2px] px-2 py-1',
        className,
      )}>
      <TextWrapper
        content={value}
        variant={'TextFieldLabel'}
        className="font-[590]"
      />
    </div>
  );
}
