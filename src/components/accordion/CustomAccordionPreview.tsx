import {IAccordionConfiguration} from '@core/interfaces/accordion-config';
import CustomAccordion from './CustomAccordion';
import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';

const accordionConfiguration: IAccordionConfiguration = {
  sections: [
    {
      accordionSectionId: 'firstSection',
      sectionProperty: [
        {
          propertyName: 'Selbstbehalt',
          propertyTitle: 'Selbstbehalt',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Hausarzt',
          propertyTitle: 'Hausarzt',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Unfall',
          propertyTitle: 'Unfall',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Status',
          propertyTitle: 'Status',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'secondSection',
      sectionProperty: [
        {
          propertyName: 'Geburtsdatum',
          propertyTitle: 'Geburtsdatum',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Gender',
          propertyTitle: 'Gender',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'thirdSection',
      sectionProperty: [
        {
          propertyName: 'Selbstbehalt',
          propertyTitle: 'Selbstbehalt',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Hausarzt',
          propertyTitle: 'Hausarzt',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Unfall',
          propertyTitle: 'Unfall',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
        {
          propertyName: 'Status',
          propertyTitle: 'Status',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
      ],
    },
  ],
  accordionTitle: 'Lukas',
};

export default function CustomAccordionPreview() {
  return (
    <CustomAccordion
      className="max-w-[1016px]"
      accordionConfiguration={accordionConfiguration}
      data={{}}
    />
  );
}
