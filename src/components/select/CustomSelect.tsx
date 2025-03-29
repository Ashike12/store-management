import FormErrorText from '@components/form/FormErrorText';
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
import { FormikErrors, FormikTouched } from 'formik';
import { get, uniqueId } from 'lodash';
import './custom-select-styles.css';

export interface ISelectOption {
  title: string;
  value: string | number | boolean;
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
}
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 400,
      maxWidth: 200, // Ensures a minimum width
      marginTop: 4,
    },
  },
  MenuListProps: {
    sx: {
      padding: 0, // Remove extra padding for consistency
      paddingY: '12px',
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
  ...props
}: Readonly<ICustomSelectProps<T>>) {
  const labelId = `${name ?? 'custom-select'}-label`;

  const isTouched = get(touched, name ?? '');
  const errorMessage = get(errors, name ?? '');
  const isError = !!errorMessage && !!isTouched;

  return (
    <FormControl className={cn('', className)} color={color}>
      {label && (
        <InputLabel
          id={labelId}
          sx={{
            '&.MuiInputLabel-shrink': {
              backgroundColor: theme => theme.palette.background.paper,
              paddingX: '7px',
              marginLeft: '-5px',
            },
          }}>
          <TextWrapper content={label} />
        </InputLabel>
      )}
      <Select
        error={isError}
        className={cn('custom-select-override', className)}
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
            value={option.value as any}
            key={option.value + uniqueId()}
            sx={{
              whiteSpace: 'normal', // Allows text to wrap
              wordBreak: 'break-word', // Breaks long words properly
              maxWidth: '100%', // Ensures it doesn't overflow
              paddingY: '10px',
            }}>
            {!option.renderOption ? (
              <>
                <TextWrapper
                  content={`${option.title}`}
                  variant={'Body2'}
                  className="text-text-primary"
                />
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
