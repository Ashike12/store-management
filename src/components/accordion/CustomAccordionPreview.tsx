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
          propertyValue: 'CHF 300.00',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Hausarzt',
          propertyTitle: 'Hausarzt',
          propertyValue: 'N/A',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Unfall',
          propertyTitle: 'Unfall',
          propertyValue: 'Inkludiert',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Status',
          propertyTitle: 'Status',
          propertyValue: 'Aktiv',
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
          propertyValue: '24.01.1993',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Gender',
          propertyTitle: 'Gender',
          propertyValue: 'Male',
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
          propertyValue: 'CHF 300.00',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Hausarzt',
          propertyTitle: 'Hausarzt',
          propertyValue: 'N/A',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Unfall',
          propertyTitle: 'Unfall',
          propertyValue: 'Inkludiert',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
        {
          propertyName: 'Status',
          propertyTitle: 'Status',
          propertyValue: 'Aktiv',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
      ],
    },
  ],
};

export default function CustomAccordionPreview() {
  return (
    <CustomAccordion
      className="max-w-[1016px]"
      accordionTitle="Telemedizin"
      accordionTitleAmount="CHF 326.50"
      accordionConfiguration={accordionConfiguration}
    />
  );
}
