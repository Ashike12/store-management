import FormErrorText from '@components/form/FormErrorText';
import useLocalization from '@core/hooks/useLocalization';
import cn from '@core/utils/cn';
import {FormControl, FormControlLabel} from '@mui/material';
import Checkbox, {CheckboxProps} from '@mui/material/Checkbox';
import {FormikErrors, FormikTouched} from 'formik';
import {get} from 'lodash';

interface ICustomChecboxProps<T> extends Omit<CheckboxProps, 'disableRipple'> {
  className?: string;
  label?: string;
  labelColor?: string;
  setFieldValue?: (
    field: string,
    value: string | number | boolean | undefined,
    shouldValidate?: boolean,
  ) => void;

  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
}

export default function CustomCheckbox<T>({
  color = 'primary',
  className,
  label = '',
  labelColor = 'var(--color-text-primary)',
  onChange,
  setFieldValue,
  name,
  touched,
  errors,
  ...props
}: Readonly<ICustomChecboxProps<T>>) {
  const translatedLabel = useLocalization({content: label});

  const isTouched = get(touched, name ?? '');
  const errorMessage = get(errors, name ?? '');
  const isError = !!errorMessage && !!isTouched;
  return (
    <FormControl
      sx={{
        '.MuiFormControlLabel-root': {
          marginRight: 0,
          color: labelColor,
        },
      }}>
      <FormControlLabel
        control={
          <Checkbox
            className={cn('', className)}
            disableRipple
            disableFocusRipple
            disableTouchRipple
            color={color}
            {...props}
            onChange={(event, checked) => {
              if (setFieldValue && name) {
                setFieldValue(name, checked);
              }
              if (onChange) {
                onChange(event, checked);
              }
            }}
          />
        }
        label={translatedLabel}
      />
      {isError && errorMessage && <FormErrorText errorMessage={errorMessage} />}
    </FormControl>
  );
}
