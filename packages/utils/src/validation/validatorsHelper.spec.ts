import { expect } from 'chai';
import moment from 'moment';
import {
  dateRangesAreSequential,
  decimalRegex,
  integerRegex,
  isEmpty,
  isoDateRegex,
  nameGyldigRegex,
  nameRegex,
  saksnummerOrFodselsnummerPattern,
  textGyldigRegex,
  textRegex,
  tomorrow,
  yesterday,
} from './validatorsHelper';

describe('validatorsHelper', () => {
  describe('isoDateRegex', () => {
    it('Skal sjekke om dato format er riktig ISO', () => {
      expect(isoDateRegex.test('2018-04-01')).is.true;
      expect(isoDateRegex.test('12-04-2018')).is.false;
    });
  });

  describe('integerRegex', () => {
    it('Skal sjekke om input er int', () => {
      expect(integerRegex.test('34')).is.true;
      expect(integerRegex.test('34.5')).is.false;
      expect(integerRegex.test('XXX')).is.false;
    });
  });

  describe('decimalRegex', () => {
    it('Skal sjekke om input er desimal', () => {
      expect(decimalRegex.test('23,34')).is.true;
      expect(decimalRegex.test('XXX')).is.false;
    });
  });

  describe('saksnummerOrFodselsnummerPattern', () => {
    it('Skal sjekke om saksnummer er i riktig format', () => {
      expect(saksnummerOrFodselsnummerPattern.test('123456789012345678')).is.true;
      expect(saksnummerOrFodselsnummerPattern.test('X123456789012345678')).is.false;
    });
  });

  describe('textRegex', () => {
    it('Skal sjekke om input er tekst', () => {
      expect(textRegex.test('text')).is.true;
      expect(textRegex.test('3434')).is.true;
    });
  });

  describe('textGyldigRegex', () => {
    it('Skal sjekke om input er i gyldig tekst format', () => {
      expect(textGyldigRegex.test('Text')).is.true;
    });
  });

  describe('nameRegex', () => {
    it('Skal sjekke om input er et navn', () => {
      expect(nameRegex.test('Ola Nordmann')).is.true;
      expect(nameRegex.test('Ola Nordmann!')).is.false;
    });
  });

  describe('nameGyldigRegex', () => {
    it('Skal sjekke om navn er et gyldig navn', () => {
      expect(nameGyldigRegex.test('Ola Nordmann')).is.true;
    });
  });

  describe('isEmpty', () => {
    it('Skal sjekke om input er tom', () => {
      const emptyText = null;
      const text = 'Not Empty';
      expect(isEmpty(emptyText)).is.true;
      expect(isEmpty(text)).is.false;
    });
  });

  describe('yesterday', () => {
    it('Skal sjekke om dato er i går', () => {
      expect(yesterday()).is.eql(moment().subtract(1, 'days').startOf('day'));
    });
  });

  describe('tomorrow', () => {
    it('Skal sjekke om dato er i morgen', () => {
      expect(tomorrow()).is.eql(moment().add(1, 'days').startOf('day'));
    });
  });

  describe('dateRangesAreSequential', () => {
    it('Skal sjekke om datoer er etter hverandre', () => {
      const rangesMatch = [
        ['2018-04-01', '2018-05-01'],
        ['2018-04-01', '2018-05-01'],
      ];
      const ranges = [
        ['2018-04-01', '2018-05-01'],
        ['2018-05-02', '2018-05-31'],
      ];
      expect(dateRangesAreSequential(rangesMatch)).is.false;
      expect(dateRangesAreSequential(ranges)).is.true;
    });
  });
});
