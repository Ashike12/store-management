import {OutlinedTextFieldProps, TextField} from '@mui/material';
import cn from '@core/utils/cn';
import useLocalization from '@core/hooks/useLocalization';
import {FormikErrors, FormikTouched} from 'formik';
import FormErrorText from '@components/form/FormErrorText';
import {get} from 'lodash';
import {useTranslation} from 'react-i18next';

interface IInputText<T> extends Omit<OutlinedTextFieldProps, 'variant'> {
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
}

export default function InputText<T>({
  label,
  helperText,
  placeholder,
  className,
  name,
  errors,
  touched,
  setFieldValue,
  ...restProps
}: Readonly<IInputText<T>>) {
  const {t} = useTranslation();
  const translatedPlaceholder = useLocalization({content: placeholder ?? ''});
  const translatedHelperText = useLocalization({content: helperText ?? ''});

  const isTouched = get(touched, name ?? '');
  const errorMessage = get(errors, name ?? '');
  const isError = !!errorMessage && !!isTouched;

  return (
    <div className={cn(className)}>
      <TextField
        name={name}
        error={isError}
        sx={{
          color: '#ffffff',
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #307ECC inset',
            WebkitTextFillColor: '#ffffff',
          },
        }}
        type="text"
        variant="outlined"
        label={label ? t(label) : undefined}
        helperText={isError ? translatedHelperText : ''}
        placeholder={`${translatedPlaceholder}`}
        className="w-full"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (setFieldValue) {
            setFieldValue(name ?? '', e.target.value, true);
          }
          if (restProps.onChange) {
            restProps.onChange(e);
          }
        }}
        {...restProps}
      />
      {isError && <FormErrorText errorMessage={errorMessage} />}
    </div>
  );
}
