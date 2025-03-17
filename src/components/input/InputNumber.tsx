import cn from '@core/utils/cn';
import {OutlinedTextFieldProps, TextField} from '@mui/material';
import useLocalization from '@core/hooks/useLocalization';
import {get} from 'lodash';
import {FormikErrors, FormikTouched} from 'formik';
import FormErrorText from '@components/form/FormErrorText';
import {REGEX_VALIDATORS} from '@core/config/regex-validator-constant';
import {useEffect, useState} from 'react';

interface IInputNumberProps<T>
  extends Omit<OutlinedTextFieldProps, 'variant' | 'type'> {
  label?: string;
  className?: string;
  helperText?: string;
  setFieldValue?: (
    field: string,
    value: string | number | boolean,
    shouldValidate?: boolean,
  ) => void;
  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
  type?: 'integer' | 'float'; // New prop to define input type
  precision?: number;
}

export default function InputNumber<T>({
  label,
  placeholder,
  helperText,
  className,
  name,
  errors,
  touched,
  setFieldValue,
  precision = 2,
  type,
  value,
  ...restProps
}: Readonly<IInputNumberProps<T>>) {
  const translateLabel = useLocalization({content: label as string});
  const translatedPlaceholder = useLocalization({content: placeholder ?? ''});
  const translatedHelperText = useLocalization({content: helperText ?? ''});
  const [inputValue, setInputValue] = useState(value || '');

  const isTouched = get(touched, name || '');
  const errorMessage = get(errors, name || '');
  const isError = !!errorMessage && !!isTouched;

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <div className={cn(className)}>
      <TextField
        type={'text'}
        value={inputValue}
        variant={'outlined'}
        label={translateLabel}
        helperText={translatedHelperText}
        placeholder={`${translatedPlaceholder}`}
        className={'w-full'}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;

          // Allow positive and negative numbers with decimals based on precision
          const regex =
            type === 'float'
              ? new RegExp(REGEX_VALIDATORS.ALLOW_NEGATIVE(precision)) // Allows negative sign and decimal up to precision
              : REGEX_VALIDATORS.ALLOW_ONLy_INTEGER_POSITIVE_NEGATIVE; // Allows only integers (positive and negative)

          if (!regex.test(newValue)) return;

          if (setFieldValue) {
            setFieldValue(name || '', e.target.value, true);
          }
          if (restProps.onChange) {
            restProps.onChange(e);
          }
        }}
        {...restProps}
      />
      {isError && errorMessage && <FormErrorText errorMessage={errorMessage} />}
    </div>
  );
}
