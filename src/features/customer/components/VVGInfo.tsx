import TextWrapper from '@components/text/TextWrapper';
import IconNotePencil from '@assets/icons/IconNotePencil';
import {IconPlus} from '@tabler/icons-react';
import {useState} from 'react';
import SideDrawer, {
  DrawerButtonAction,
} from '@components/side-drawer/SideDrawer';
import {ICustomAccordionEditAction} from '@core/interfaces/accordion-config';
import {CustomButton} from '@components/button/CustomButton';
import IconShieldPlus from '@assets/icons/IconShieldPlus';

// GRUNDVERSICHERUNG -> Basic Health Insurance or KVG Information
export default function VVGInfo() {
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const data = null;
  const [open, setOpen] = useState(false);

  const handleEditClick = (action?: ICustomAccordionEditAction) => {
    setDrawerTitle(action?.accordionProperty.propertyTitle ?? '');
    setOpen(true);
  };

  const handleAddKvgButtonClick = (titleKey: string) => {
    setDrawerTitle(titleKey);
    setOpen(true);
  };

  const handleDrawerButtonAction = (action: DrawerButtonAction) => {
    switch (action.actionType) {
      case 'undo':
        console.log('Undo');
        break;
      case 'redo':
        console.log('Redo');
        break;
      case 'primary':
        console.log('Primary');
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
    <div className="bg-common-white border-transparent-grey-24 flex w-full flex-col gap-[13px] rounded border px-5 pt-4 pb-5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-[5px]">
          <IconShieldPlus />
          <TextWrapper
            content={'ADDITIONAL_INSURANCE'}
            variant={'CardTitle'}
            className="text-text-secondary uppercase"
          />
        </div>
        {data && (
          <div className="text-interaction-main flex items-start gap-4">
            <button className="flex cursor-pointer items-center justify-center">
              <IconPlus size={20} />
            </button>
            <button
              onClick={() => handleEditClick()}
              className="flex cursor-pointer items-center justify-center">
              <IconNotePencil size={20} />
            </button>
          </div>
        )}
      </div>
      {!data && (
        <div className="flex items-center gap-4">
          <CustomButton
            onClick={() => handleAddKvgButtonClick('ADD_VVG')}
            text={'ADD_VVG'}
            iconAlign="left"
            Icon={IconPlus}
            variant={'ghost'}
          />
        </div>
      )}

      <SideDrawer
        primryButtonTextKey={'SAVE'}
        secondaryButtonTextKey={'CANCEL'}
        title={drawerTitle ?? 'All'}
        open={open}
        onClose={() => setOpen(false)}
        width={'570px'}
        buttonAction={handleDrawerButtonAction}
        primarySecondaryButtonGapClass={'gap-5'}
        enableUndoRedo={false}>
        <div></div>
      </SideDrawer>
    </div>
  );
}
