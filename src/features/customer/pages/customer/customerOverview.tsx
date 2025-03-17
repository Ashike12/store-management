import VVGInfo from '@features/customer/components/VVGInfo';
import BasicInfo from '../../components/BasicInfo';
import KVGInfo from '../../components/kvg-info/KVGInfo';

export default function customerOverview() {
  return (
    <div className="flex w-full flex-col gap-5">
      <BasicInfo />
      <KVGInfo />
      <VVGInfo />
    </div>
  );
}
