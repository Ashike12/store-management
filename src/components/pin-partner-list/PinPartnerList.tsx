import PinPartnerCard from '@components/pin-partner-card/PinPartnerCard';
import {useAppSelector} from '@core/store/hooks';
import {selectPinnedPartners} from '@core/store/slices/pinned-partner.slice';

interface IPartnerListProps {
  open: boolean;
}

export default function PinPartnerList({open}: Readonly<IPartnerListProps>) {
  const pinnedPartners = useAppSelector(selectPinnedPartners);
  return (
    <div className="flex w-full flex-col gap-4">
      {pinnedPartners.map(partner => (
        <PinPartnerCard
          key={partner.id}
          PartnerId={partner.id}
          PartnerName={`${partner.partner.vorname} ${partner.partner.name}`}
          InsuranceNumber={partner.partner.ahvNummer}
          open={open}
        />
      ))}
    </div>
  );
}
