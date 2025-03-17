import CustomCheckbox from '@components/checkbox/CustomCheckbox';
import CustomDatePicker from '@components/date-picker/CustomDatePicker';
import CustomSelect from '@components/select/CustomSelect';
import TextWrapper from '@components/text/TextWrapper';
import {
  FieldConfig,
  FieldInputProps,
  FormikErrors,
  FormikTouched,
} from 'formik';

interface IPartnerContactFormProps {
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

export default function PartnerContactForm({
  setFieldValue,
  getFieldProps,
  handleBlur,
  touched,
  errors,
}: Readonly<IPartnerContactFormProps>) {
  return (
    <>
      <TextWrapper
        content={'KUNDENKONTAKT'}
        variant={'Subtitle1'}
        className="text-text-primary"
      />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-4">
        <CustomSelect
          label="KONTAKT_NR"
          name="kontaktNr"
          value={getFieldProps('kontaktNr')?.value as string}
          setFieldValue={setFieldValue}
          options={[{title: 'NEUER_KONTAKT', value: '0'}]}
          onBlur={handleBlur}
          touched={touched}
          errors={errors}
        />
        <CustomSelect
          label="KANAL"
          name="kanal"
          setFieldValue={setFieldValue}
          value={getFieldProps('kanal')?.value as string}
          options={[
            {title: 'TELEFON', value: '0'},
            {title: 'AGENTUR', value: '1'},
            {title: 'EMAIL', value: '2'},
          ]}
          onBlur={handleBlur}
          touched={touched}
          errors={errors}
        />
        <CustomSelect
          label="RICHTUNG"
          name="richtung"
          setFieldValue={setFieldValue}
          value={getFieldProps('richtung')?.value as string}
          options={[
            {title: 'EINGEHEND', value: '0'},
            {title: 'AUSGEHEND', value: '1'},
          ]}
          onBlur={handleBlur}
          touched={touched}
          errors={errors}
        />
        <CustomDatePicker
          label="EINGANGSDATUM"
          name="Eingangsdatum"
          className="w-full"
          shrink={true}
          setFieldValue={setFieldValue}
          value={getFieldProps('Eingangsdatum')?.value as string}
          onBlur={handleBlur}
          touched={touched}
          errors={errors}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between pt-6">
        <CustomSelect
          className="w-[98%]"
          label="BEMERKUNG"
          name="bemerkung"
          setFieldValue={setFieldValue}
          value={getFieldProps('bemerkung')?.value as string}
          options={[{title: 'ERGANZENDE_ANGABEN', value: '0'}]}
        />
        <div className="flex flex-row items-center justify-start">
          <CustomCheckbox
            className="rounded-none"
            label="VERTRAULICH"
            labelColor="var(--color-text-secondary)"
            name="Vertraulich"
            setFieldValue={setFieldValue}
            value={getFieldProps('Vertraulich')?.value as string}
          />
        </div>
      </div>
    </>
  );
}
