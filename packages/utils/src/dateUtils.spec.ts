import { expect } from 'chai';

import {
  addDaysToDate,
  calcDaysAndWeeks,
  calcDaysAndWeeksWithWeekends,
  dateFormat,
  findDifferenceInMonthsAndDays,
  splitWeeksAndDays,
  timeFormat,
} from './dateUtils';

describe('dateutils', () => {
  describe('calcDaysAndWeeksWithWeekends', () => {
    it('Skal kalkulere antall dager mellom to datoer inkludert helger og skrive det ut som uker og dager', () => {
      const fom = '2018-04-17';
      const tom = '2018-06-02';
      const formatedMessage = {
        id: 'UttakInfoPanel.AntallFlereDagerOgFlereUker',
        weeks: 6,
        days: 5,
      };
      expect(calcDaysAndWeeksWithWeekends(fom, tom)).is.deep.equal(formatedMessage);
    });
  });

  describe('calcDaysAndWeeks', () => {
    it('Skal kalkulere antall dager mellom to datoer uten helger og skrive det ut som uker og dager', () => {
      const fom = '2018-04-17';
      const tom = '2018-06-02';
      const formatedMessage = {
        id: 'UttakInfoPanel.AntallFlereDagerOgFlereUker',
        weeks: 6,
        days: 4,
      };
      expect(calcDaysAndWeeks(fom, tom)).is.deep.equal(formatedMessage);
    });
  });

  describe('splitWeeksAndDays', () => {
    it('Skal kalkulere antall dager mellom to datoer inkludert helger og skrive det ut som uker og dager', () => {
      const days = 33;
      const weeks = 2;
      expect(splitWeeksAndDays(weeks, days)).is.eql([{ weeks: 4, days: 1 }, { weeks: 4, days: 2 }]);
    });
  });

  describe('dateFormat', () => {
    it('Skal formatere en dato til ISO', () => {
      const dateTime = '2017-08-02T01:54:25.455';
      expect(dateFormat(dateTime)).is.eql('02.08.2017');
    });
  });

  describe('timeFormat', () => {
    it('Skal formatere et dato til å vise kun klokkeslett', () => {
      const dateTime = '2017-08-02T01:54:25.455';
      expect(timeFormat(dateTime)).is.eql('01:54');
    });
  });

  describe('addDaysToDate', () => {
    it('Skal legge til dager på et timestamp og returnere dato', () => {
      const dateTime = '2017-08-02T01:54:25.455';
      const daysToAdd = 6;
      expect(addDaysToDate(dateTime, daysToAdd)).is.eql('2017-08-08');
    });
  });

  describe('findDifferenceInMonthsAndDays', () => {
    it('skal vise at perioden mellom to datoer er på 5 måneder og 0 dager', () => {
      const fomDate = '2017-12-01';
      const tomDate = '2018-04-30';
      expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).is.eql({
        months: 5,
        days: 0,
      });
    });

    it('skal vise at perioden mellom to datoer er på 11 dager', () => {
      const fomDate = '2018-04-20';
      const tomDate = '2018-04-30';
      expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).is.eql({
        months: 0,
        days: 11,
      });
    });

    it('skal returnere undefined når periode ikke er gyldig fordi fomDato er etter tomDato', () => {
      const fomDate = '2018-04-30';
      const tomDate = '2018-04-10';
      expect(findDifferenceInMonthsAndDays(fomDate, tomDate)).is.undefined;
    });
  });
});
