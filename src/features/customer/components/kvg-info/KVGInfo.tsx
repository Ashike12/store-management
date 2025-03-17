import CustomAccordion from '@components/accordion/CustomAccordion';
import {KVGDataConfig} from '../../configs/KVGDataConfig';
import IconShieldStar from '@assets/icons/IconShieldStar';
import TextWrapper from '@components/text/TextWrapper';
import IconNotePencil from '@assets/icons/IconNotePencil';
import {IconPlus} from '@tabler/icons-react';
import {useState} from 'react';
import SideDrawer from '@components/side-drawer/SideDrawer';
import {ICustomAccordionEditAction} from '@core/interfaces/accordion-config';
import {CustomButton} from '@components/button/CustomButton';
import {useGetKvgDataByPartnerIdQuery} from '@core/store/api/kvgMitgliedApi';
import {useParams} from 'react-router-dom';
import formatMitgliedDataToUI from '../../utils/formatMitgliedDataToUI';
import {getPartnerMitgliedIdByPartnerId} from '@core/store/slices/pinned-partner.slice';
import {useAppSelector} from '@core/store/hooks';
import ManageAccidentDrawer from './manage-accident/ManageAccidentDrawer';
import ChangeDeductibleDrawer from './change-deductible/ChangeDeductibleDrawer';

// GRUNDVERSICHERUNG -> Basic Health Insurance or KVG Information
export default function KVGInfo() {
  const [drawerTitle, setDrawerTitle] = useState<string>();
  const {id} = useParams();
  const kvgMitgliedId = useAppSelector(state =>
    getPartnerMitgliedIdByPartnerId(state, id ?? ''),
  );
  const {data} = useGetKvgDataByPartnerIdQuery(kvgMitgliedId ?? '');
  const uiData = data ? formatMitgliedDataToUI(data) : undefined;
  const [open, setOpen] = useState(false);

  const handleEditClick = (action?: ICustomAccordionEditAction) => {
    switch (action?.accordionProperty.propertyTitle) {
      case 'ACCIDENT':
        setDrawerTitle('CHANGE_ACCIDENT_COVER');
        break;
      case 'FRANCHISE':
        setDrawerTitle('CHANGE_DEDUCTIBLE');
        break;
      default:
        setDrawerTitle(action?.accordionProperty.propertyTitle ?? '');
    }
    setOpen(true);
  };

  const renderDrawer = () => {
    switch (drawerTitle) {
      case 'CHANGE_ACCIDENT_COVER':
        return <ManageAccidentDrawer open={open} setOpen={setOpen} />;
      case 'CHANGE_DEDUCTIBLE':
        return <ChangeDeductibleDrawer open={open} setOpen={setOpen} />;
      default:
        return (
          <SideDrawer
            primryButtonTextKey={'SAVE'}
            secondaryButtonTextKey={'CANCEL'}
            title={drawerTitle ?? 'All'}
            open={open}
            onClose={() => setOpen(false)}
            width={'500px'}
            primarySecondaryButtonGapClass={'gap-5'}
            enableUndoRedo={true}
          />
        );
    }
  };

  const handleAddKvgButtonClick = (titleKey: string) => {
    setDrawerTitle(titleKey);
    setOpen(true);
  };

  return (
    <div className="bg-common-white border-transparent-grey-24 flex w-full flex-col gap-[13px] rounded border px-5 pt-4 pb-5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-[5px]">
          <IconShieldStar />
          <TextWrapper
            content={'BASIC_INSURANCE'}
            variant={'CardTitle'}
            className="text-text-secondary uppercase"
          />
          {data && (
            <TextWrapper
              content={`(${data.mitgliedsnummer})`}
              variant={'CardTitle'}
            />
          )}
        </div>
        {data && (
          <div className="text-interaction-main flex items-start gap-4">
            <button className="flex cursor-pointer items-center justify-center">
              <IconPlus size={20} />
            </button>
            <button className="flex cursor-pointer items-center justify-center">
              <IconNotePencil size={20} />
            </button>
          </div>
        )}
      </div>
      {!data && (
        <div className="flex items-center gap-4">
          <CustomButton
            onClick={() => handleAddKvgButtonClick('ADD_KVG')}
            text={'ADD_KVG'}
            iconAlign="left"
            Icon={IconPlus}
            variant={'ghost'}
          />
        </div>
      )}

      {data && (
        <CustomAccordion
          className="w-full"
          data={uiData ? uiData : {}}
          accordionConfiguration={KVGDataConfig}
          handleEditClick={handleEditClick}
        />
      )}
      {renderDrawer()}
    </div>
  );
}
