import moment from 'moment/moment';
import {
  DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, HHMM_TIME_FORMAT,
} from 'utils/formats';

export const TIDENES_ENDE = '9999-12-31';

const checkDays = (weeks, days) => {
  const weeksDaysObj = {
    weeks,
    days,
  };

  let id = 'UttakInfoPanel.AntallFlereDagerOgFlereUker';

  if (weeks === undefined && days === undefined) {
    id = 'UttakInfoPanel.TidenesEnde';
  }

  if (days === 0) {
    id = weeks === 1 ? 'UttakInfoPanel.AntallNullDagerOgEnUke' : 'UttakInfoPanel.AntallNullDagerOgFlereUker';
  }

  if (weeks === 0) {
    id = days === 1 ? 'UttakInfoPanel.AntallEnDagOgNullUker' : 'UttakInfoPanel.AntallFlereDagerOgNullUker';
  }

  if (days === 1) {
    id = weeks === 1 ? 'UttakInfoPanel.AntallEnDagOgEnUke' : 'UttakInfoPanel.AntallEnDagOgFlereUker';
  }

  if (weeks === 1) {
    id = 'UttakInfoPanel.AntallFlereDagerOgEnUke';
  }

  return {
    id,
    ...weeksDaysObj,
  };
};

export const calcDaysAndWeeksWithWeekends = (fraDatoPeriode, tilDatoPeriode) => {
  if (tilDatoPeriode === TIDENES_ENDE) {
    return checkDays(undefined, undefined);
  }
  const fraDato = moment(fraDatoPeriode, ISO_DATE_FORMAT);
  const tilDato = moment(tilDatoPeriode, ISO_DATE_FORMAT);

  // Vi legger til én dag for å få med startdato i perioden
  const duration = tilDato.diff(fraDato, 'days') + 1;

  const weeks = Math.floor(duration / 7);
  const days = duration % 7;

  return checkDays(weeks, days);
};

export const calcDaysAndWeeks = (fraDatoPeriode, tilDatoPeriode) => {
  if (tilDatoPeriode === TIDENES_ENDE) {
    return checkDays(undefined, undefined);
  }

  const fraDato = moment(fraDatoPeriode, ISO_DATE_FORMAT);
  const tilDato = moment(tilDatoPeriode, ISO_DATE_FORMAT);
  let count = tilDato.diff(fraDato, 'days');
  let date = moment(fraDatoPeriode, ISO_DATE_FORMAT);
  let numOfDays = date.isoWeekday() !== 6 && date.isoWeekday() !== 7 ? 1 : 0;

  while (count > 0) {
    date = date.add(1, 'days');

    if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
      numOfDays += 1;
    }

    count -= 1;
  }

  const weeks = Math.floor(numOfDays / 5);
  const days = numOfDays % 5;

  return checkDays(weeks, days);
};

export const calcDaysWithoutWeekends = (fraDatoPeriode, tilDatoPeriode) => {
  if (tilDatoPeriode === TIDENES_ENDE) {
    return checkDays(undefined, undefined);
  }
  const fraDato = moment(fraDatoPeriode, ISO_DATE_FORMAT);
  const tilDato = moment(tilDatoPeriode, ISO_DATE_FORMAT);

  let count = tilDato.diff(fraDato, 'days');
  let date = moment(fraDatoPeriode, ISO_DATE_FORMAT);
  let numOfDays = date.isoWeekday() !== 6 && date.isoWeekday() !== 7 ? 1 : 0;

  while (count > 0) {
    date = date.add(1, 'days');

    if (date.isoWeekday() !== 6 && date.isoWeekday() !== 7) {
      numOfDays += 1;
    }

    count -= 1;
  }

  return numOfDays;
};

export const splitWeeksAndDays = (weeks, days) => {
  const returnArray = [];
  const allDays = weeks ? (weeks * 5) + days : days;
  const firstPeriodDays = allDays % 2 === 0 ? allDays / 2 : (allDays / 2) + 0.5;
  const secondPeriodDays = allDays % 2 === 0 ? allDays / 2 : (allDays / 2) - 0.5;
  const firstPeriodWeeksAndDays = { weeks: Math.trunc(firstPeriodDays / 5), days: firstPeriodDays % 5 };
  const secondPeriodWeeksAndDays = { weeks: Math.trunc(secondPeriodDays / 5), days: secondPeriodDays % 5 };
  returnArray.push(secondPeriodWeeksAndDays, firstPeriodWeeksAndDays);
  return returnArray;
};

export const dateFormat = date => moment(date).format(DDMMYYYY_DATE_FORMAT);

export const timeFormat = date => moment(date).format(HHMM_TIME_FORMAT);

// Skal ikke legge til dag når dato er tidenes ende
export const addDaysToDate = (dateString, nrOfDays) => (dateString === TIDENES_ENDE
  ? dateString
  : moment(dateString, ISO_DATE_FORMAT).add(nrOfDays, 'days').format(ISO_DATE_FORMAT));


export const findDifferenceInMonthsAndDays = (fomDate, tomDate) => {
  const fDate = moment(fomDate, ISO_DATE_FORMAT, true);
  const tDate = moment(tomDate, ISO_DATE_FORMAT, true).add(1, 'days');
  if (!fDate.isValid() || !tDate.isValid() || fDate.isAfter(tDate)) {
    return undefined;
  }

  const months = tDate.diff(fDate, 'months');
  fDate.add(months, 'months');

  return {
    months,
    days: tDate.diff(fDate, 'days'),
  };
};

export const findDifferenceInHoursAndMinutes = (fomDateTime, tomDateTime) => {
  const fDate = moment(fomDateTime);
  const tDate = moment(tomDateTime);
  if (!fDate.isValid() || !tDate.isValid() || fDate.isAfter(tDate)) {
    return undefined;
  }

  const hours = tDate.diff(fDate, 'hours');
  fDate.add(hours, 'hours');

  return {
    hours,
    minutes: tDate.diff(fDate, 'minutes'),
  };
};

export const getDateAndTime = (tidspunkt) => {
  const dateTime = moment(tidspunkt);
  const date = dateTime.format(DDMMYYYY_DATE_FORMAT);
  const time = dateTime.format(HHMM_TIME_FORMAT);
  return { date, time };
};
