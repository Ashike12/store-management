import {SideDrawerProps} from '@components/side-drawer/SideDrawer';
import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';
export interface IAccordionSectionProperty {
  propertyName: string;
  propertyTitle: string;
  propertyValueType: EnumAccordionSectionPropertyValue;
  editable: boolean;
  sideDrawerPropsOnEdit?: SideDrawerProps;
}

export interface IAccordionSection {
  accordionSectionId: string;
  sectionProperty: IAccordionSectionProperty[];
}

export type IAccordionSections = IAccordionSection[];

export interface IAccordionConfiguration {
  sectionHeaderValue?: string;
  sections: IAccordionSections;
  accordionTitle: string;
  accordionTitleAmount?: string;
  accordionTitlePropertyName: string;
  accordionTitleAmountPropertyName?: string;
}

export interface ICustomAccordionEditAction {
  sectionId: string;
  accordionProperty: IAccordionSectionProperty;
}
