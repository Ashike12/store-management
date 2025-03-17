import {get} from 'lodash';
import {useTranslation} from 'react-i18next';
import {FormikErrors, FormikTouched} from 'formik';
import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  Paper,
  PaperProps,
  TextField,
} from '@mui/material';
import FormErrorText from '@components/form/FormErrorText';

interface ICustomAutoCompleteProps<T, U>
  extends Omit<
    AutocompleteProps<
      T,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
    >,
    'renderInput' | 'getOptionLabel'
  > {
  label?: string;
  className?: string;
  name?: string;
  setFieldValue?: (
    field: string,
    value: any | undefined,
    shouldValidate?: boolean,
  ) => void;
  options: T[];
  getOptionLabel?: (option: T) => string;
  touched?: FormikTouched<U>;
  errors?: FormikErrors<U>;
}

const AutocompletePaper = (props: PaperProps) => (
  <Paper elevation={8} {...props} />
);

export default function CustomAutoComplete<T, U>({
  options,
  label,
  id,
  getOptionLabel,
  disableClearable,
  value,
  onChange,
  setFieldValue,
  touched,
  errors,
  name,
  ...props
}: Readonly<ICustomAutoCompleteProps<T, U>>) {
  const {t} = useTranslation();
  const isTouched = get(touched, name ?? '');
  const errorMessage = get(errors, name ?? '');
  const isError = !!errorMessage && !!isTouched;
  return (
    <FormControl>
      <Autocomplete
        freeSolo
        id={id}
        value={value}
        disableClearable={disableClearable}
        options={options}
        getOptionLabel={getOptionLabel as any}
        onChange={(event, value, reason) => {
          if (setFieldValue && name) {
            if (value) {
              setFieldValue(name, value);
            }
          }
          if (onChange) {
            onChange(event, value, reason);
          }
        }}
        renderInput={params => (
          <TextField
            {...params}
            error={isError}
            label={label ? t(label) : undefined}
            slotProps={{
              input: {
                ...params.InputProps,
                type: 'text',
                inputMode: 'text',
              },
            }}
          />
        )}
        slots={{paper: AutocompletePaper}}
        {...props}
      />
      {isError && errorMessage && <FormErrorText errorMessage={errorMessage} />}
    </FormControl>
  );
}
