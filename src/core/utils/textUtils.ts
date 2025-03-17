import {DEAFULT_NOT_FOUND} from '@core/config/constants';

export function convertCurrencyTypeUIValue(
  content: number | null,
  currency: string | null,
  currencyPosition?: 'left' | 'right',
): string {
  const numberWithTwoDecimal = convertNumberTypeUIValue(content);
  if (currency && currencyPosition === 'left') {
    return `${currency} ${numberWithTwoDecimal}`;
  } else if (currency && currencyPosition === 'right') {
    return `${numberWithTwoDecimal} ${currency}`;
  }
  return numberWithTwoDecimal;
}

export function convertNumberTypeUIValue(content: number | null): string {
  const numberWithTwoDecimal = isNaN(Number(content))
    ? DEAFULT_NOT_FOUND
    : Number(content).toFixed(2);
  return numberWithTwoDecimal;
}
