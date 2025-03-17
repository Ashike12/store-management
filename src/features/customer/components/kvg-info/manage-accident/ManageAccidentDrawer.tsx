import SideDrawer, {
  DrawerButtonAction,
} from '@components/side-drawer/SideDrawer';
import ManageAccident from './ManageAccident';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {CustomButton} from '@components/button/CustomButton';
import {validateAndSubmit} from '@core/utils/setTouchedAndSubmitForm';

const ManageAccidentSchema = Yup.object().shape({
  Bemerkung: Yup.string().required('This filed is required'),
  Gültig: Yup.string().required('This filed is required'),
  kontakt: Yup.string().required('This filed is required'),
});
export default function ManageAccidentDrawer({
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
    validationSchema: ManageAccidentSchema,
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
        title={'CHANGE_ACCIDENT_COVER'}
        open={open}
        onClose={() => setOpen(false)}
        width={'650px'}
        buttonAction={handleDrawerButtonAction}
        primarySecondaryButtonGapClass={'gap-5'}
        enableUndoRedo={true}
        footerRightContent={
          <>
            <CustomButton
              className="w-[50%] cursor-pointer"
              text={'CANCEL'}
              variant={'outline'}
              onClick={() => console.log('Secondary')}
            />
            <CustomButton
              className="w-[50%] cursor-pointer"
              text={'SAVE'}
              variant={'primary'}
              type="submit"
              onClick={async () => {
                validateAndSubmit(handleSubmit, validateForm, setTouched);
              }}
            />
          </>
        }>
        <ManageAccident
          open={open}
          setFieldValue={setFieldValue}
          getFieldProps={getFieldProps}
          touched={touched}
          errors={errors}
          handleBlur={handleBlur}
        />
      </SideDrawer>
    </form>
  );
}
