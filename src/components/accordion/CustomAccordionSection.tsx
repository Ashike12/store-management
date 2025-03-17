import IconNotePencil from '@assets/icons/IconNotePencil';
import CurrencyTextWrapper from '@components/text/CurrencyTextWrapper';
import TextWrapper from '@components/text/TextWrapper';
import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';
import {
  IAccordionSection,
  IAccordionSectionProperty,
  ICustomAccordionEditAction,
} from '@core/interfaces/accordion-config';
import {customerAccordionPropertyContent} from './CustomerAccordionPropertyContent';

interface ICustomAccordionSectionProps {
  accordionSection: IAccordionSection;
  data: object;
  handleEditClickSection: (action: ICustomAccordionEditAction) => void;
}

export default function CustomAccordionSection({
  accordionSection,
  data,
  handleEditClickSection,
}: Readonly<ICustomAccordionSectionProps>) {
  const propertyTypeEnum = EnumAccordionSectionPropertyValue;
  const handlePropertyEditClick = (
    sectionId: string,
    accordionProperty: IAccordionSectionProperty,
  ) => {
    handleEditClickSection({sectionId, accordionProperty});
  };

  return (
    <div className="bg-common-white @container flex w-full items-center justify-center rounded px-4 py-2">
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 @min-3xl:max-w-[720px] @min-3xl:gap-x-[40px]">
        {accordionSection.sectionProperty.map((property, index) => (
          <div
            key={`${property.propertyName}-${index}`}
            className="flex w-full items-start justify-between gap-4">
            <TextWrapper
              content={property.propertyTitle}
              variant={'Body2'}
              className="text-text-secondary"
            />
            <div className="flex items-start gap-4 text-end">
              {customerAccordionPropertyContent(property, data)}
              {property.editable && (
                <button
                  className="flex cursor-pointer items-center justify-center focus:outline-none"
                  onClick={() => {
                    handlePropertyEditClick(
                      accordionSection.accordionSectionId,
                      property,
                    );
                  }}>
                  <IconNotePencil color="#2E65CE" size={20} />
                </button>
              )}
              {!property.editable && <div className="w-5"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
