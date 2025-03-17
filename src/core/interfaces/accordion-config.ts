import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';

export interface IAccordionSectionProperty {
  propertyName: string;
  propertyTitle: string;
  propertyValue: string | number;
  propertyValueType: EnumAccordionSectionPropertyValue;
  editable: boolean;
}

export interface IAccordionSection {
  accordionSectionId: string;
  sectionProperty: IAccordionSectionProperty[];
}

export type IAccordionSections = IAccordionSection[];

export interface IAccordionConfiguration {
  sections: IAccordionSections;
}
