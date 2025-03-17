import FormErrorText from '@components/form/FormErrorText';
import TextWrapper from '@components/text/TextWrapper';
import {
  FormControlLabel,
  FormControlLabelProps,
  InputLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material';
import {FormikErrors, FormikTouched} from 'formik';
import {get} from 'lodash';
import {useTranslation} from 'react-i18next';

export interface IRadioGroupOption
  extends Omit<FormControlLabelProps, 'control'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  label: string;
}

interface ICustomRadioGroupProps<T> extends RadioGroupProps {
  label?: string;
  options: IRadioGroupOption[];
  direction?: 'vertical' | 'horizontal';
  setFieldValue?: (
    field: string,
    value: string | number | boolean,
    shouldValidate?: boolean,
  ) => void;
  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
}

export default function CustomRadioGroup<T>({
  options,
  name,
  label,
  setFieldValue,
  direction = 'horizontal',
  touched,
  errors,
  ...restProps
}: Readonly<ICustomRadioGroupProps<T>>) {
  const {t} = useTranslation();

  const isTouched = get(touched, name || '');
  const errorMessage = get(errors, name || '');
  const isError = !!errorMessage && !!isTouched;

  return (
    <>
      <RadioGroup
        name={name}
        onChange={(event, value) => {
          if (setFieldValue) {
            setFieldValue(name || '', value, true);
          }
          if (restProps.onChange) {
            restProps.onChange(event, value);
          }
        }}
        {...restProps}>
        {label && (
          <InputLabel>
            <TextWrapper
              content={label}
              className="bg-background-default px-0.5"
            />
          </InputLabel>
        )}
        <div
          className="flex"
          style={{flexDirection: direction === 'vertical' ? 'column' : 'row'}}>
          {options.map(({value, label, ...optionRestProps}) => (
            <FormControlLabel
              key={value}
              value={value}
              control={
                <Radio disableFocusRipple disableRipple disableTouchRipple />
              }
              label={t(label)}
              {...optionRestProps}
            />
          ))}
        </div>
        {isError && errorMessage && (
          <FormErrorText errorMessage={errorMessage} />
        )}
      </RadioGroup>
    </>
  );
}
