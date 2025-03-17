import FormErrorText from '@components/form/FormErrorText';
import I18nTextWrapper from '@components/text/I18nTextWrapper';
import TextWrapper from '@components/text/TextWrapper';
import cn from '@core/utils/cn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  BaseSelectProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import {FormikErrors, FormikTouched} from 'formik';
import {get, uniqueId} from 'lodash';

export interface ISelectOption {
  title: string;
  value: string | number;
  renderOption?: (title: string) => React.JSX.Element;
}

interface ICustomSelectProps<T> extends BaseSelectProps {
  label?: string;
  id?: string;
  className?: string;
  options: ISelectOption[];
  setFieldValue?: (
    field: string,
    value: string | number | boolean | undefined,
    shouldValidate?: boolean,
  ) => void;

  touched?: FormikTouched<T>;
  errors?: FormikErrors<T>;
  isI18NTranslation?: boolean;
}
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400,
      maxWidth: 200, // Ensures a minimum width
    },
  },
  MenuListProps: {
    sx: {
      padding: 0, // Remove extra padding for consistency
    },
  },
};

export default function CustomSelect<T>({
  color = 'primary',
  className,
  label,
  options,
  onChange,
  setFieldValue,
  name,
  touched,
  errors,
  isI18NTranslation = false,
  ...props
}: Readonly<ICustomSelectProps<T>>) {
  const labelId = `${name ?? 'custom-select'}-label`;

  const isTouched = get(touched, name ?? '');
  const errorMessage = get(errors, name ?? '');
  const isError = !!errorMessage && !!isTouched;

  return (
    <FormControl
      className={cn('text-input select-override', className)}
      color={color}>
      {label && (
        <InputLabel id={labelId}>
          <TextWrapper
            content={label}
            className="bg-background-default px-0.5"
          />
        </InputLabel>
      )}
      <Select
        error={isError}
        className={cn('', className)}
        color={color}
        IconComponent={KeyboardArrowDownIcon}
        labelId={labelId}
        name={name}
        onChange={(event, child) => {
          if (setFieldValue) {
            setFieldValue(name ?? '', event.target.value as any, true);
          }
          if (onChange) {
            onChange(event, child);
          }
        }}
        MenuProps={MenuProps}
        {...props}>
        {options.map(option => (
          <MenuItem
            value={option.value}
            key={option.value + uniqueId()}
            sx={{
              whiteSpace: 'normal', // Allows text to wrap
              wordBreak: 'break-word', // Breaks long words properly
              maxWidth: '100%', // Ensures it doesn't overflow
            }}>
            {!option.renderOption ? (
              <>
                {isI18NTranslation ? (
                  <I18nTextWrapper
                    content={`${option.value}`}
                    variant={'Body2'}
                    className="text-text-primary capitalize"
                  />
                ) : (
                  <TextWrapper
                    content={`${option.title}`}
                    variant={'Body2'}
                    className="text-text-primary"
                  />
                )}
              </>
            ) : (
              option.renderOption(option.title)
            )}
          </MenuItem>
        ))}
      </Select>
      {isError && errorMessage && <FormErrorText errorMessage={errorMessage} />}
    </FormControl>
  );
}
