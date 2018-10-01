export { default as createVisningsnavnForAktivitet } from './arbeidsforholdUtil';
export {
  range,
  flatten,
  haystack,
  isArrayEmpty,
  without,
  zip,
} from './arrayUtils';
export {
  isIE11,
  isEdge,
  getRelatedTargetIE11,
} from './browserUtils';
export {
  formatCurrencyWithKr,
  formatCurrencyNoKr,
  parseCurrencyInput,
  removeSpacesFromNumber,
} from './currencyUtils';
export {
  calcDaysWithoutWeekends,
  addDaysToDate,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  dateFormat,
  findDifferenceInMonthsAndDays,
  splitWeeksAndDays,
  TIDENES_ENDE,
  timeFormat,
} from './dateUtils';
export { default as decodeHtmlEntity } from './decodeHtmlEntityUtils';
export {
  fodselsnummerPattern,
  isValidFodselsnummer,
} from './fodselsnummerUtils';
export {
  ISO_DATE_FORMAT,
  DDMMYYYY_DATE_FORMAT,
  HHMM_TIME_FORMAT,
  ACCEPTED_DATE_INPUT_FORMATS,
} from './formats';
export { default as guid } from './guidUtil';
export {
  replaceNorwegianCharacters,
  getLanguageCodeFromSprakkode,
} from './languageUtils';
export {
  notNull,
  isObjectEmpty,
  arrayToObject,
  diff,
  isEqual,
  isEqualToOneOf,
  isObject,
  omit,
} from './objectUtils';
export { default as getAddresses } from './personUtils';
export {
  parseQueryString,
  buildPath,
  formatArray,
  formatQueryString, parseArray,
} from './urlUtils';
