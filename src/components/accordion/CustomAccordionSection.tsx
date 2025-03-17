import IconNotePencil from '@assets/icons/IconNotePencil';
import TextWrapper from '@components/text/TextWrapper';
import {
  IAccordionSection,
  IAccordionSectionProperty,
} from '@core/interfaces/accordion-config';

interface ICustomAccordionSectionProps {
  accordionSection: IAccordionSection;
}

export default function CustomAccordionSection({
  accordionSection,
}: Readonly<ICustomAccordionSectionProps>) {
  const handlePropertyEditClick = (
    sectionId: string,
    accordionProperty: IAccordionSectionProperty,
  ) => {
    console.info({sectionId, accordionProperty});
  };

  console.log(accordionSection.accordionSectionId);

  return (
    <div className="bg-common-white grid w-full grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-x-4 gap-y-4 rounded p-2">
      {accordionSection.sectionProperty.map(property => (
        <div
          key={property.propertyName}
          className="flex w-full items-center justify-between">
          <TextWrapper
            content={property.propertyTitle}
            variant={'Body2'}
            className="text-text-secondary"
          />
          <div className="flex items-center gap-2">
            <TextWrapper
              content={property.propertyValue}
              variant={'Body2'}
              className="text-text-primary"
            />
            {property.editable && (
              <button
                className="flex cursor-pointer items-center justify-center"
                onClick={() => {
                  handlePropertyEditClick(
                    accordionSection.accordionSectionId,
                    property,
                  );
                }}>
                <IconNotePencil color="#2E65CE" size={20} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
