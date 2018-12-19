export { default as createVisningsnavnForAktivitet } from './src/arbeidsforholdUtil';
export {
  range,
  flatten,
  haystack,
  isArrayEmpty,
  without,
  zip,
} from './src/arrayUtils';
export {
  isIE11,
  isEdge,
  getRelatedTargetIE11,
} from './src/browserUtils';
export {
  formatCurrencyWithKr,
  formatCurrencyNoKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
} from './src/currencyUtils';
export {
  calcDaysWithoutWeekends,
  addDaysToDate,
  calcDays,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  dateFormat,
  findDifferenceInMonthsAndDays,
  splitWeeksAndDays,
  TIDENES_ENDE,
  timeFormat,
  getRangeOfMonths,
} from './src/dateUtils';
export { default as decodeHtmlEntity } from './src/decodeHtmlEntityUtils';
export {
  fodselsnummerPattern,
  isValidFodselsnummer,
} from './src/fodselsnummerUtils';
export {
  ISO_DATE_FORMAT,
  DDMMYYYY_DATE_FORMAT,
  DDMMYY_DATE_FORMAT,
  HHMM_TIME_FORMAT,
  ACCEPTED_DATE_INPUT_FORMATS,
} from './src/formats';
export { default as guid } from './src/guidUtil';
export {
  replaceNorwegianCharacters,
  getLanguageCodeFromSprakkode,
} from './src/languageUtils';
export {
  notNull,
  isObjectEmpty,
  arrayToObject,
  diff,
  isEqual,
  isEqualToOneOf,
  isObject,
  omit,
} from './src/objectUtils';
export { default as getAddresses } from './src/personUtils';
export {
  parseQueryString,
  buildPath,
  formatArray,
  formatQueryString,
  parseArray,
} from './src/urlUtils';
export {
  ariaCheck,
  validateProsentandel,
  isUtbetalingsgradMerSamitidigUttaksprosent,
  isUkerOgDagerVidNullUtbetalningsgrad,
  isWithinOpptjeningsperiode,
  hasValidPeriod,
  hasValidPeriodIncludingOtherErrors,
  isDatesEqual,
  dateIsAfter,
  arrayMinLength,
  hasValidValue,
  hasValidName,
  hasValidText,
  hasValidFodselsnummer,
  hasValidFodselsnummerFormat,
  dateAfterOrEqualToToday,
  dateAfterToday,
  dateBeforeOrEqualToToday,
  dateBeforeToday,
  dateRangesNotOverlapping,
  dateAfterOrEqual,
  dateBeforeOrEqual,
  hasValidDate,
  hasValidSaksnummerOrFodselsnummerFormat,
  hasValidDecimal,
  hasValidInteger,
  maxValue,
  minValue,
  maxLength,
  minLength,
  requiredIfCustomFunctionIsTrue,
  requiredIfNotPristine,
  notDash,
  required,
  maxLengthOrFodselsnr,
  isArbeidsProsentVidUtsettelse100,
  isutbetalingPlusArbeidsprosentMerEn100,
} from './src/validation/validators';

export {
  isRequiredMessage,
  sammeFodselsnummerSomSokerMessage,
  dateRangesOverlappingMessage,
  invalidPeriodMessage,
  invalidDateMessage,
  invalidDecimalMessage,
  dateNotBeforeOrEqualMessage,
  dateNotAfterOrEqualMessage,
} from './src/validation/messages';
