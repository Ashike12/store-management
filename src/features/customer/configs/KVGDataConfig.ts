import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';
import {IAccordionConfiguration} from '@core/interfaces/accordion-config';

export const KVGDataConfig: IAccordionConfiguration = {
  sectionHeaderValue: '',
  accordionTitle: 'Telemedizin',
  accordionTitlePropertyName: 'tarif_tarifbezeichnung',
  accordionTitleAmount: 'CHF 326.50',
  accordionTitleAmountPropertyName: 'tarif_praemieTotal',
  sections: [
    {
      accordionSectionId: 'kvg-deductible',
      sectionProperty: [
        {
          propertyName: 'tarif_franchiseKey',
          propertyTitle: 'FRANCHISE',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: true,
        },
        {
          propertyName: 'lerbHausarztRef',
          propertyTitle: 'GENERAL_PRACTITIONER',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'tarif_unfalleinschluss',
          propertyTitle: 'ACCIDENT',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'mitgliedsstatusKey',
          propertyTitle: 'STATUS',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-premium',
      sectionProperty: [
        {
          propertyName: 'tarif_praemieKrankheit_praemieUnfall',
          propertyTitle: 'PREMIUM_AMOUNT',
          propertyValueType: EnumAccordionSectionPropertyValue.CURRENCY,
          editable: false,
        },
        {
          propertyName: 'tarif_umweltabgabe',
          propertyTitle: 'ENVIRONMENTAL_TAX',
          propertyValueType: EnumAccordionSectionPropertyValue.CURRENCY,
          editable: false,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-policyholder',
      sectionProperty: [
        {
          propertyName: 'partnerVersicherungsnehmerRef',
          propertyTitle: 'POLICYHOLDER',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
        {
          propertyName: 'zahlungsinfoLeistungAuszahlungRef',
          propertyTitle: 'BENEFICIARY',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'zahlungsrhythmusKey',
          propertyTitle: 'PAYMENT_FREQUENCY',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: false,
        },
        {
          propertyName: 'zahlungsinfoLeistungForderungRef',
          propertyTitle: 'BENEFIT_PAYER',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-avb',
      sectionProperty: [
        {
          propertyName: 'avbRef',
          propertyTitle: 'AVB_AMOUNT',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-Address',
      sectionProperty: [
        {
          propertyName: 'versicherter_plz_ort_gemeindeName',
          propertyTitle: 'REWARD_LOCATION',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'tarif_regionKey',
          propertyTitle: 'PREMIUM_REGION',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: false,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-admission',
      sectionProperty: [
        {
          propertyName: 'eintrittInKasse',
          propertyTitle: 'ADMISSION',
          propertyValueType: EnumAccordionSectionPropertyValue.DATE,
          editable: false,
        },
        {
          propertyName: 'eintrittsgrundKey',
          propertyTitle: 'REASON',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: false,
        },
        {
          propertyName: 'vorversicherer',
          propertyTitle: 'PROCESSOR',
          propertyValueType: EnumAccordionSectionPropertyValue.CURRENCY,
          editable: false,
        },
        {
          propertyName: 'zuzugVomAuslandAm',
          propertyTitle: 'IMMIGRATION',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-termination-reason',
      sectionProperty: [
        {
          propertyName: 'austrittsgrundKey',
          propertyTitle: 'TERMINATION_REASON',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
        {
          propertyName: 'nachversicherer',
          propertyTitle: 'SUBSEQUENT_INSURER',
          propertyValueType: EnumAccordionSectionPropertyValue.CURRENCY,
          editable: false,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-previous-insurer',
      sectionProperty: [
        {
          propertyName: 'abschlusskanalKey',
          propertyTitle: 'PREVIOUS_INSURER',
          propertyValueType: EnumAccordionSectionPropertyValue.LOCALIZATIONKEY,
          editable: false,
        },
        {
          propertyName: 'vertriebsmitarbeiterRef',
          propertyTitle: 'SALES_EMPLOYEE',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: false,
        },
      ],
    },
    {
      accordionSectionId: 'kvg-creation-info',
      sectionProperty: [
        {
          propertyName: 'Erstelltvon',
          propertyTitle: 'CREATED_BY',
          propertyValueType: EnumAccordionSectionPropertyValue.TEXT,
          editable: true,
        },
        {
          propertyName: 'Erstelltam',
          propertyTitle: 'CREATED_ON',
          propertyValueType: EnumAccordionSectionPropertyValue.DATE,
          editable: false,
        },
      ],
    },
  ],
};
