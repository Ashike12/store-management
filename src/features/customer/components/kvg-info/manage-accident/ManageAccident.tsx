import CustomCheckbox from '@components/checkbox/CustomCheckbox';
import CustomDatePicker from '@components/date-picker/CustomDatePicker';
import CustomSelect from '@components/select/CustomSelect';
import CustomTextField from '@components/input/InputText';
import TextWrapper from '@components/text/TextWrapper';
import {InputLabel} from '@mui/material';
import ManageAccidentTable from './manage-accident-table/ManageAccidentTable';
import {
  FieldConfig,
  FieldInputProps,
  FormikErrors,
  FormikTouched,
} from 'formik';

interface IManageAccidentProps {
  open: boolean;
  setFieldValue: (
    field: string,
    value: string | number | boolean | Date | undefined,
    shouldValidate?: boolean,
  ) => void;
  getFieldProps: (
    nameOrOptions: string | FieldConfig<string | number>,
  ) => FieldInputProps<string | number>;
  touched: FormikTouched<object>;
  errors: FormikErrors<object>;
  handleBlur: {
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    <T = unknown>(
      fieldOrEvent: T,
    ): T extends string ? (e: React.FocusEvent<HTMLElement>) => void : void;
  };
}
export default function ManageAccident({
  open,
  setFieldValue,
  getFieldProps,
  handleBlur,
  touched,
  errors,
}: Readonly<IManageAccidentProps>) {
  return (
    <div className="flex flex-col gap-4 px-3 py-6">
      <div className="border-grey-grey-200 rounded-md border px-2 pt-2 pb-6">
        <TextWrapper
          content={'KUNDENKONTAKT'}
          variant={'Subtitle1'}
          className="text-text-primary"
        />
        <div className="grid grid-cols-2 gap-4 pt-4">
          <CustomSelect
            label="KONTAKT"
            name="kontakt"
            defaultValue="0"
            setFieldValue={setFieldValue}
            options={[
              {title: 'neuer Kontakt hinzufügen', value: '0'},
              {title: 'Recent Contacts', value: '1'},
            ]}
            onBlur={handleBlur}
            touched={touched}
            errors={errors}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <CustomSelect
            label="Kontakt-Nr."
            id="kontaktNr"
            defaultValue="0"
            options={[
              {title: '4711', value: '0'},
              {title: '4722', value: '1'},
              {title: '4839', value: '2'},
            ]}
          />
          <CustomSelect
            label="Kanal"
            defaultValue="0"
            options={[
              {title: 'Telefon', value: '0'},
              {title: 'Agentur', value: '1'},
              {title: 'Email', value: '2'},
            ]}
          />
          <CustomSelect
            label="Richtung"
            id="richtung"
            defaultValue="0"
            options={[
              {title: 'Eingehend', value: '0'},
              {title: 'Ausgehend', value: '1'},
            ]}
          />
          <CustomDatePicker
            name="Eingangsdatum"
            label="Eingangsdatum"
            className="w-full"
            shrink={true}
            setFieldValue={setFieldValue}
          />
        </div>
        <div className="flex w-full flex-row items-center justify-start pt-4">
          <CustomTextField
            className="w-[85%]"
            label="Bemerkung"
            placeholder="Ergänzende Angaben zum Kundenkontakt"
            value={getFieldProps('Bemerkung')?.value as string}
            name="Bemerkung"
            setFieldValue={setFieldValue}
            onBlur={handleBlur}
            touched={touched}
            errors={errors}
          />
          <div className="flex flex-row items-center justify-start">
            <CustomCheckbox className="rounded-none" />
            <InputLabel>
              <TextWrapper content={'Vertraulich'} variant={'Body1'} />
            </InputLabel>
          </div>
        </div>
      </div>
      <div className="border-grey-grey-200 rounded-md border px-2 pt-4 pb-3">
        <div className="grid grid-cols-2 gap-4 pb-8">
          <CustomDatePicker
            name="Gültig"
            label="Gültig ab"
            className="w-full"
            focus={open}
            shrink={true}
            setFieldValue={setFieldValue}
            onBlur={handleBlur}
            touched={touched}
            errors={errors}
          />
          <CustomSelect
            label="Grund"
            id="grund"
            defaultValue="0"
            options={[
              {title: 'Kundenwunsch', value: '0'},
              {title: 'Korrektur', value: '1'},
            ]}
          />
        </div>
        <div className="w-full">
          <ManageAccidentTable />
        </div>
      </div>
    </div>
  );
}
