export const REGEX_VALIDATORS = {
  ALLOW_NEGATIVE: (precision: number) => `^-?\\d*(\\.\\d{0,${precision}})?$`,
  ALLOW_ONLy_INTEGER_POSITIVE_NEGATIVE: /^-?\d*$/,
  ZEMIS_NUMBER: /^[\d\w]{3}\.[\d\w]{3}\.[\d\w]{3}\-[\d\w]$/,
  AHV_NUMBER: /^(\d{3})\.(\d{4}\.\d{4}\.\d)(\w)$/,
} as const;
