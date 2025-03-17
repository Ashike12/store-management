import {CustomButton} from '@components/button/CustomButton';
import PartnerContactForm from '@components/partner-contact/PartnerContactForm';
import SideDrawer, {
  DrawerButtonAction,
} from '@components/side-drawer/SideDrawer';
import TextWrapper from '@components/text/TextWrapper';
import {validateAndSubmit} from '@core/utils/setTouchedAndSubmitForm';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import ChangeDeductibleTable from './ChangeDeductibleTable';
import IconInfo from '@assets/icons/IconInfo';
import CustomCheckbox from '@components/checkbox/CustomCheckbox';
const ChangeDeductibleSchema = Yup.object().shape({
  Bemerkung: Yup.string().required('This filed is required'),
  KontaktNr: Yup.string().required('This filed is required'),
});

export default function ChangeDeductibleDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    setTouched,
    validateForm,
    handleBlur,
    touched,
    errors,
    handleSubmit,
    setFieldValue,
    getFieldProps,
  } = useFormik({
    initialValues: {},
    validationSchema: ChangeDeductibleSchema,
    onSubmit: values => {
      console.log('Form Submitted', values);
    },
  });
  const handleDrawerButtonAction = (action: DrawerButtonAction) => {
    switch (action.actionType) {
      case 'undo':
        console.log('Undo');
        break;
      case 'redo':
        console.log('Redo');
        break;
      case 'secondary':
        console.log('Secondary');
        setOpen(false);
        break;
      default:
        break;
    }
  };
  return (
    <form>
      <SideDrawer
        primryButtonTextKey={'SAVE'}
        secondaryButtonTextKey={'CANCEL'}
        title={'CHANGE_DEDUCTIBLE'}
        open={open}
        onClose={() => setOpen(false)}
        width={'650px'}
        buttonAction={handleDrawerButtonAction}
        primarySecondaryButtonGapClass={'gap-5'}
        enableUndoRedo={true}
        footerRightContent={
          <>
            <CustomButton
              className="w-1/3 cursor-pointer"
              text={'MINIMIZE'}
              variant={'ghost'}
              onClick={() => console.log('Minimize')}
            />
            <CustomButton
              className="w-1/3 cursor-pointer"
              text={'CANCEL'}
              variant={'ghost'}
              onClick={() => setOpen(false)}
            />
            <CustomButton
              className="w-1/3 cursor-pointer"
              text={'SAVE'}
              variant={'primary'}
              type="submit"
              onClick={async () => {
                validateAndSubmit(handleSubmit, validateForm, setTouched);
              }}
            />
          </>
        }>
        <div className="p-5">
          <div className="pb-10">
            <PartnerContactForm
              setFieldValue={setFieldValue}
              getFieldProps={getFieldProps}
              touched={touched}
              errors={errors}
              handleBlur={handleBlur}
            />
          </div>
          <div className="w-full">
            <TextWrapper
              content={'VERSICHERUNGSDECKUNG_ANDERN'}
              variant={'Subtitle1'}
              className="text-text-primary"
            />
            <div className="pt-4">
              <ChangeDeductibleTable />
            </div>
            <div className="border-transparent-grey-16 bg-background-neutral mt-4 flex flex-row justify-between rounded-sm border px-3 py-2">
              <div className="flex items-center gap-2">
                <IconInfo />
                <TextWrapper
                  content={'FEHLENDE_INFORMATIONEN'}
                  variant={'Body2'}
                  className="text-text-secondary"
                />
              </div>
              <CustomCheckbox
                label={'WARNUNG_BESTATIGEN'}
                className="text-text-secondary"
                labelColor="var(--color-text-secondary)"
              />
            </div>
          </div>
        </div>
      </SideDrawer>
    </form>
  );
}
