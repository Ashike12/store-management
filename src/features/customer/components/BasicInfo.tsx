import CustomAccordion from '@components/accordion/CustomAccordion';
import TextWrapper from '@components/text/TextWrapper';
import {BasicInfoDataConfig} from '../configs/BasicInfoDataConfig';
import IconShieldStar from '@assets/icons/IconShieldStar';
import IconTableOutline from '@assets/icons/IconTableOutline';
import IconNotePencil from '@assets/icons/IconNotePencil';
import {useGetCustomerByIdQuery} from '@core/store/api';
import {useParams} from 'react-router-dom';
export default function BasicInfo() {
  const {id} = useParams();

  const {data} = useGetCustomerByIdQuery(id as string);

  return (
    <div className="bg-common-white border-transparent-grey-24 flex w-full flex-col gap-[13px] rounded border px-5 pt-4 pb-5">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-[5px]">
          <IconShieldStar />
          <TextWrapper
            content={'BASIC_INFORMATION'}
            variant={'CardTitle'}
            className="text-text-secondary uppercase"
          />
        </div>
        <div className="text-interaction-main flex items-start gap-4">
          <button className="flex cursor-pointer items-center justify-center">
            <IconTableOutline size={20} />
          </button>
          <button className="flex cursor-pointer items-center justify-center">
            <IconNotePencil size={20} />
          </button>
        </div>
      </div>
      <CustomAccordion
        className="w-full"
        accordionConfiguration={{
          ...BasicInfoDataConfig,
          accordionTitle: data?.fullName || '',
        }}
        data={data || {}}
      />
    </div>
  );
}
