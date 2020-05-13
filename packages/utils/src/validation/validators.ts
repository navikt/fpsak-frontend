import moment from 'moment';
import { fodselsnummerPattern, isValidFodselsnummer } from '../fodselsnummerUtils';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '../formats';
import {
  arbeidsprosentMåVare100VidUtsettelseAvArbeidMessage,
  arrayMinLengthMessage,
  dateNotAfterOrEqualMessage,
  dateNotBeforeOrEqualMessage,
  dateRangesOverlappingBetweenPeriodTypesMessage,
  dateRangesOverlappingMessage,
  datesNotEqual,
  invalidDateMessage,
  invalidDatesInPeriodMessage,
  invalidDecimalMessage,
  invalidFodselsnummerFormatMessage,
  invalidFodselsnummerMessage,
  invalidIntegerMessage,
  invalidNumberMessage,
  invalidOrgNumberMessage,
  invalidOrgNumberOrFodselsnrMessage,
  invalidPeriodMessage,
  invalidPeriodRangeMessage,
  invalidSaksnummerOrFodselsnummerFormatMessage,
  invalidTextMessage,
  invalidValueMessage,
  isRequiredMessage,
  maxLengthMessage,
  maxLengthOrFodselsnrMessage,
  maxValueMessage,
  merEn100ProsentMessage,
  minLengthMessage,
  minValueMessage,
  trekkdagerErMerEnnNullUtsettelseMessage,
  ukerOgDagerVidNullUtbetalningsgradMessage,
  utbetalingMerEnnNullUtsettelseMessage,
  utbetalingsgradErMerSamtidigUttaksprosentMessage,
} from './messages';
import {
  dateRangesAreSequential,
  decimalRegex,
  integerRegex,
  isEmpty,
  isoDateRegex,
  nameGyldigRegex,
  nameRegex,
  numberRegex,
  saksnummerOrFodselsnummerPattern,
  textGyldigRegex,
  textRegex,
  tomorrow,
  yesterday,
} from './validatorsHelper';

export const maxLengthOrFodselsnr = (length) => (text) => (isEmpty(text)
  || text.toString().trim().length <= length ? null : maxLengthOrFodselsnrMessage(length));
export const required = (value) => (isEmpty(value) ? isRequiredMessage() : undefined);
export const notDash = (value) => (value === '-' ? isRequiredMessage() : undefined);
export const requiredIfNotPristine = (value, allValues, props) => (props.pristine || !isEmpty(value) ? undefined : isRequiredMessage());
export const requiredIfCustomFunctionIsTrue = (isRequiredFunction) => (value, allValues, props) => (isEmpty(value) && isRequiredFunction(allValues, props)
  ? isRequiredMessage() : undefined);

export const minLength = (length) => (text) => (isEmpty(text) || text.toString().trim().length >= length ? null : minLengthMessage(length));
export const maxLength = (length) => (text) => (isEmpty(text) || text.toString().trim().length <= length ? null : maxLengthMessage(length));

export const minValue = (length) => (number) => (number >= length ? null : minValueMessage(length));
export const maxValue = (length) => (number) => (number <= length ? null : maxValueMessage(length));

export const hasValidOrgNumber = (number) => (number.toString().trim().length === 9 ? null : invalidOrgNumberMessage());
export const hasValidOrgNumberOrFodselsnr = (number) => (number.toString().trim().length === 9 || number.toString().trim().length === 11
  ? null : invalidOrgNumberOrFodselsnrMessage());

const hasValidNumber = (text) => (isEmpty(text) || numberRegex.test(text) ? null : invalidNumberMessage(text));
const hasValidInt = (text) => (isEmpty(text) || integerRegex.test(text) ? null : invalidIntegerMessage(text));
const hasValidDec = (text) => (isEmpty(text) || decimalRegex.test(text) ? null : invalidDecimalMessage(text));
export const hasValidInteger = (text) => (hasValidNumber(text) || hasValidInt(text));
export const hasValidDecimal = (text) => (hasValidNumber(text) || hasValidDec(text));

export const hasValidSaksnummerOrFodselsnummerFormat = (text) => (isEmpty(text) || saksnummerOrFodselsnummerPattern.test(text)
  ? null : invalidSaksnummerOrFodselsnummerFormatMessage());

export const hasValidDate = (text) => (isEmpty(text) || isoDateRegex.test(text) ? null : invalidDateMessage());
export const dateBeforeOrEqual = (latest) => (text) => (
  (isEmpty(text) || moment(text).isSameOrBefore(moment(latest).startOf('day')))
    ? null
    : dateNotBeforeOrEqualMessage(moment(latest).format(DDMMYYYY_DATE_FORMAT))
);
const getErrorMessage = (earliest, customErrorMessage) => {
  const date = moment(earliest).format(DDMMYYYY_DATE_FORMAT);
  return customErrorMessage ? customErrorMessage(date) : dateNotAfterOrEqualMessage(date);
};
export const dateAfterOrEqual = (earliest, customErrorMessageFunction = undefined) => (text) => (
  (isEmpty(text) || moment(text).isSameOrAfter(moment(earliest).startOf('day')))
    ? null
    : getErrorMessage(earliest, customErrorMessageFunction)
);
export const dateIsBefore = (dateToCheckAgainst, errorMessageFunction) => (inputDate) => (
  (isEmpty(inputDate) || moment(inputDate).isBefore(moment(dateToCheckAgainst).startOf('day')))
    ? null
    : errorMessageFunction(moment(dateToCheckAgainst).format(DDMMYYYY_DATE_FORMAT))
);

export const dateRangesNotOverlapping = (ranges) => (dateRangesAreSequential(ranges) ? null : dateRangesOverlappingMessage());
export const dateRangesNotOverlappingCrossTypes = (ranges) => (dateRangesAreSequential(ranges) ? null : dateRangesOverlappingBetweenPeriodTypesMessage());

export const dateBeforeToday = (text) => dateBeforeOrEqual(yesterday())(text);
export const dateBeforeOrEqualToToday = (text) => dateBeforeOrEqual(moment().startOf('day'))(text);
export const dateAfterToday = (text) => dateAfterOrEqual(tomorrow())(text);
export const dateAfterOrEqualToToday = (text) => dateAfterOrEqual(moment().startOf('day'))(text);

export const hasValidFodselsnummerFormat = (text) => (!fodselsnummerPattern.test(text) ? invalidFodselsnummerFormatMessage() : null);
export const hasValidFodselsnummer = (text) => (!isValidFodselsnummer(text) ? invalidFodselsnummerMessage() : null);

export const hasValidText = (text) => {
  if (!textRegex.test(text)) {
    const illegalChars = text.replace(textGyldigRegex, '');
    return invalidTextMessage(illegalChars.replace(/[\t]/g, 'Tabulatortegn'));
  }
  return null;
};

export const hasValidName = (text) => {
  if (!nameRegex.test(text)) {
    const illegalChars = text.replace(nameGyldigRegex, '');
    return invalidTextMessage(illegalChars.replace(/[\t]/g, 'Tabulatortegn'));
  }
  return null;
};

export const hasValidValue = (value) => (invalidValue) => (value === invalidValue ? invalidValueMessage(value) : null);
export const arrayMinLength = (length) => (value) => (value && value.length >= length ? null : arrayMinLengthMessage(length));

export const dateIsAfter = (date, checkAgainsDate) => moment(date).isAfter(checkAgainsDate);
export const isDatesEqual = (date1, date2) => (date1 !== date2 ? datesNotEqual(moment(date2).format(DDMMYYYY_DATE_FORMAT)) : null);

const validateDate = (dateAsText, date, earliestDate, latestDate) => {
  const error = required(dateAsText) || hasValidDate(dateAsText);
  if (!error && earliestDate) {
    return dateAfterOrEqual(earliestDate)(date);
  }
  if (!error && latestDate) {
    return dateBeforeOrEqual(latestDate)(date);
  }
  return error;
};

interface Options {
  todayOrBefore?: boolean;
  todayOrAfter?: boolean;
  tidligstDato?: string;
}

export const hasValidPeriodIncludingOtherErrors = (values, otherErrors = [{}], options: Options = {}) => {
  const today = moment().format(ISO_DATE_FORMAT);
  let earliestDate = options.todayOrAfter ? today : null;
  if (options.tidligstDato) {
    earliestDate = options.tidligstDato;
  }
  const latestDate = options.todayOrBefore ? today : null;
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const arrayErrors = values.map(({ periodeFom, periodeTom }, index) => {
    const periodeFomDate = moment(periodeFom, ISO_DATE_FORMAT);
    const periodeTomDate = moment(periodeTom, ISO_DATE_FORMAT);
    const periodeFomError = validateDate(periodeFom, periodeFomDate, earliestDate, latestDate);
    let periodeTomError = validateDate(periodeTom, periodeTomDate, earliestDate, latestDate);
    if (!periodeFomError) {
      periodeTomError = periodeTomError || dateAfterOrEqual(periodeFomDate)(periodeTomDate);
    }
    if (periodeFomError || periodeTomError || otherErrors[index] !== null) {
      return {
        periodeFom: periodeFomError,
        periodeTom: periodeTomError,
        ...otherErrors[index],
      };
    }
    return null;
  });
  if (arrayErrors.some((errors) => errors !== null)) {
    return arrayErrors;
  }
  const overlapError = dateRangesNotOverlapping(values.map(({ periodeFom, periodeTom }) => [periodeFom, periodeTom]));
  if (overlapError) {
    return { _error: overlapError };
  }
  return null;
};

export const validPeriodeFomTom = (fomDate, tomDate) => {
  if (isEmpty(fomDate) && isEmpty(tomDate)) {
    return null;
  }
  return moment(fomDate).isSameOrBefore(moment(tomDate).startOf('day')) ? null : invalidPeriodMessage();
};

export const hasValidPeriod = (fomDate, tomDate) => {
  if (isEmpty(fomDate) && isEmpty(tomDate)) {
    return null;
  }
  if (!isoDateRegex.test(fomDate) || !isoDateRegex.test(tomDate)) {
    return invalidDatesInPeriodMessage();
  }
  return moment(fomDate).isSameOrBefore(moment(tomDate).startOf('day')) ? null : invalidPeriodMessage();
};

export const isWithinOpptjeningsperiode = (fomDateLimit, tomDateLimit) => (fom, tom) => {
  const isBefore = moment(fom).isBefore(moment(fomDateLimit));
  const isAfter = moment(tom).isAfter(moment(tomDateLimit));
  return isBefore || isAfter ? invalidPeriodRangeMessage() : null;
};

export const isUtbetalingsgradMerSamitidigUttaksprosent = (samtidigUttaksProsent, utbetalingsgrad) => {
  if (samtidigUttaksProsent < utbetalingsgrad) {
    return utbetalingsgradErMerSamtidigUttaksprosentMessage();
  }
  return null;
};

export const isUkerOgDagerVidNullUtbetalningsgrad = (weeks, days, utbetalingsgrad) => {
  if (weeks === 0 && days === 0 && utbetalingsgrad > 0) {
    return ukerOgDagerVidNullUtbetalningsgradMessage();
  }
  return null;
};

export const isutbetalingPlusArbeidsprosentMerEn100 = (utbetalingsgrad, prosentArbeid) => {
  if (utbetalingsgrad + prosentArbeid > 100) {
    return merEn100ProsentMessage();
  }
  return null;
};

const getSum = (total, num) => total + num;

export const isArbeidsProsentVidUtsettelse100 = (values, aktivitetArray) => {
  const andelIArbeid = [0];
  if (values.utsettelseType && values.erOppfylt && aktivitetArray) {
    aktivitetArray.forEach((aktivitet) => {
      andelIArbeid.push(aktivitet.prosentArbeid);
    });
    const prosentIArbeid = andelIArbeid.reduce(getSum);
    if (prosentIArbeid < 100) {
      return arbeidsprosentMåVare100VidUtsettelseAvArbeidMessage();
    }
    return null;
  }
  return null;
};

export const validateProsentandel = (prosentandel) => required(prosentandel) || hasValidDecimal(prosentandel) || hasValidNumber(prosentandel.replace('.', ''));

export const ariaCheck = () => {
  let errors;
  setTimeout(() => {
    if (document.getElementsByClassName('skjemaelement__feilmelding').length > 0) {
      errors = document.getElementsByClassName('skjemaelement__feilmelding');
    } else if (document.getElementsByClassName('alertstripe--advarsel')) {
      errors = (document.getElementsByClassName('alertstripe--advarsel'));
    }
    if (errors && errors.length > 0) {
      const ariaNavTab = document.createAttribute('tabindex');
      ariaNavTab.value = '-1';
      const firstError = errors[0];
      firstError.setAttributeNode(ariaNavTab);
      const element = document.activeElement as HTMLElement;
      element.blur();
      firstError.focus();
    }
  }, 300);
};

export const isTrekkdagerMerEnnNullUtsettelse = (value) => (value > 0 ? trekkdagerErMerEnnNullUtsettelseMessage() : null);

export const isUtbetalingMerEnnNullUtsettelse = (value) => (value > 0 ? utbetalingMerEnnNullUtsettelseMessage() : null);
