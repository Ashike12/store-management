import cn from '@core/utils/cn';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import dayjs, {Dayjs} from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import IconCalendarDots from '@assets/icons/IconCalendarDots';
import FormErrorText from '@components/form/FormErrorText';
import {get} from 'lodash';
import {FormikErrors, FormikTouched} from 'formik';
import {useTranslation} from 'react-i18next';
interface ICustomerDatePickerProps<T> {
  name: string;
  value?: string | Date;
  label: string;
  className?: string;
  disabled?: boolean;
  minDate?: string | Date;
  maxDate?: string | Date;
  focus?: boolean;
  shrink?: boolean;
  onChange?: (date: Dayjs | null) => void;
  dateFormat?: string;
  setFieldValue?: (
    field: string,
    value: string | number | boolean,
    shouldValidate?: boolean,
  ) => void;
  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
  onBlur?: {
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    <T = unknown>(
      fieldOrEvent: T,
    ): T extends string ? (e: React.FocusEvent<HTMLElement>) => void : void;
  };
}

export default function CustomDatePicker<T>({
  name,
  value,
  label,
  className,
  minDate,
  maxDate,
  onChange,
  setFieldValue,
  touched,
  errors,
  onBlur,
  dateFormat = 'DD.MM.YYYY',
  ...props
}: Readonly<ICustomerDatePickerProps<T>>) {
  const {t} = useTranslation();
  const dateValue = value ? dayjs(value) : null;

  const isTouched = get(touched, name || '');
  const errorMessage = get(errors, name || '');
  const isError = !!errorMessage && !!isTouched;

  const handleChange = (newValue: Dayjs | null) => {
    if (!newValue) {
      return;
    }
    const date = newValue.format('YYYY-MM-DD');
    if (setFieldValue) {
      setFieldValue(name, date);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={cn(className)}>
        <DatePicker
          label={t(label)}
          className="w-full"
          name={name}
          value={dateValue}
          onChange={handleChange}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          format={dateFormat}
          views={['year', 'month', 'day']}
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'window',
                  },
                },
              ],
            },
            textField: {
              error: isError,
              onBlur: onBlur,
            },
          }}
          slots={{
            openPickerIcon: IconCalendarDots,
          }}
          {...props}
        />

        {isError && <FormErrorText errorMessage={errorMessage} />}
      </div>
    </LocalizationProvider>
  );
}
