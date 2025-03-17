import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';
import {IAccordionConfiguration} from '@core/interfaces/accordion-config';

export const BasicInfoDataConfig: IAccordionConfiguration = {
  accordionTitle: 'Lukas Habegger',
  accordionTitleAmount: '',
  accordionTitlePropertyName: '',
  accordionTitleAmountPropertyName: '',
  sections: [
    {
      accordionSectionId: 'basic-info',
      sectionProperty: [
        {
          propertyName: 'geburtsdatum',
          propertyTitle: 'DATE_OF_BIRTH',
          propertyValueType: EnumAccordionSectionPropertyValue.DATE,
          editable: true,
        },
        {
          propertyName: 'geschlechtKey',
          propertyTitle: 'GENDER',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: true,
        },
        {
          propertyName: 'partnerNummer',
          propertyTitle: 'PARTNER_NUMBER',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
        {
          propertyName: 'ahvNummer',
          propertyTitle: 'AHV_NR',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-address',
      sectionProperty: [
        {
          propertyName: 'Adresse Domizil',
          propertyTitle: 'DOMICILE_ADDRESS',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Zweite-adresse',
          propertyTitle: 'SECOND_ADDRESS',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-contanct',
      sectionProperty: [
        {
          propertyName: 'Telefon',
          propertyTitle: 'TELEPHONE',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'E-Mail',
          propertyTitle: 'E_MAIL',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-language',
      sectionProperty: [
        {
          propertyName: 'sprache',
          propertyTitle: 'LANGUAGE',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'korrespondenzSprache',
          propertyTitle: 'CORRESPONDENCE_LANGUAGE',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-marriage-death',
      sectionProperty: [
        {
          propertyName: 'Zivilstand',
          propertyTitle: 'MARITAL_STATUS',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Todesdatum',
          propertyTitle: 'DATE_OF_DEATH',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-nationality',
      sectionProperty: [
        {
          propertyName: 'nationalitaet',
          propertyTitle: 'NATIONALITY',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'aufenthaltsbewilligungKey',
          propertyTitle: 'RESIDENCE_PERMIT',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: true,
        },
        {
          propertyName: 'aufenthaltBis',
          propertyTitle: 'AUTHORIZED_UNTIL',
          propertyValueType: EnumAccordionSectionPropertyValue.DATE,
          editable: false,
        },
        {
          propertyName: 'ZEMIS-Nr.',
          propertyTitle: 'ZEMIS_NO',
          propertyValueType: EnumAccordionSectionPropertyValue.NUMBER,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'basic-access',
      sectionProperty: [
        {
          propertyName: 'zugriffsschutzKey',
          propertyTitle: 'ACCESS_CONTROL',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: true,
        },
      ],
    },
  ],
};
