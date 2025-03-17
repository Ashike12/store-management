import CurrencyTextWrapper from '@components/text/CurrencyTextWrapper';
import I18nTextWrapper from '@components/text/I18nTextWrapper';
import NumberTextWrapper from '@components/text/NumberTextWrapper';
import TextWrapper from '@components/text/TextWrapper';
import {DEAFULT_NOT_FOUND} from '@core/config/constants';
import {EnumAccordionSectionPropertyValue} from '@core/enums/accordion.enum';
import {IAccordionSectionProperty} from '@core/interfaces/accordion-config';

export const customerAccordionPropertyContent = (
  property: IAccordionSectionProperty,
  data: object,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  const value = data[property.propertyName];

  switch (property.propertyValueType) {
    case EnumAccordionSectionPropertyValue.CURRENCY:
      return (
        <CurrencyTextWrapper
          content={value} // Ensure valid number
          variant="Body2"
          className="text-text-primary break-all"
        />
      );
    case EnumAccordionSectionPropertyValue.NUMBER:
      return (
        <NumberTextWrapper
          content={value} // Ensure valid number
          variant="Body2"
          className="text-text-primary break-all"
        />
      );
    case EnumAccordionSectionPropertyValue.LOCALIZATIONKEY:
      return (
        <I18nTextWrapper
          content={value} // Ensure valid number
          variant="Body2"
          className="text-text-primary break-all"
        />
      );
    default:
      return (
        <TextWrapper
          content={typeof value === 'string' ? value : DEAFULT_NOT_FOUND} // Ensure valid string
          variant="Body2"
          className="text-text-primary break-all"
        />
      );
  }
};
