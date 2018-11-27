import { expect } from 'chai';
import moment from 'moment';
import { ISO_DATE_FORMAT } from 'utils/formats';

import { dateRangesOverlappingMessage, invalidDateMessage, invalidDecimalMessage } from 'utils/validation/messages';
import { PermisjonGraderingPanel } from './PermisjonGraderingPanel';

describe('<PermisjonGraderingPanel>', () => {
  const getPeriodDaysFromToday = (periodeForGradering, prosentandelArbeid, startDaysFromToday, endDaysFromToday) => ({
    periodeFom: moment().add(startDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    periodeTom: moment().add(endDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    periodeForGradering,
    prosentandelArbeid,
  });

  const getPeriod = (periodeForGradering, prosentandelArbeid, periodeFom, periodeTom) => ({
    periodeFom,
    periodeTom,
    periodeForGradering,
    prosentandelArbeid,
  });

  const periodeForGradering = 'TEST';
  const validDecimal = '40';
  const invalidDecimal = '40,222';

  it('skal validere at prosentandel er desimaltall', () => {
    const errorsWithInvalidDecimal = PermisjonGraderingPanel.validate([getPeriodDaysFromToday(periodeForGradering, invalidDecimal, -20, -15)]);
    const errorsWithValidNumber = PermisjonGraderingPanel.validate([getPeriodDaysFromToday(periodeForGradering, validDecimal, -20, -15)]);

    expect(errorsWithInvalidDecimal).to.be.an('array');
    expect(errorsWithInvalidDecimal[0].prosentandelArbeid).to.be.an('array').that.eql(invalidDecimalMessage(invalidDecimal));
    expect(errorsWithInvalidDecimal[1]).to.not.exist;

    expect(errorsWithValidNumber).to.not.exist;
  });

  it('skal validere at alle perioder har gyldige datoer', () => {
    const errorsWithInvalidDates = PermisjonGraderingPanel.validate([getPeriod(periodeForGradering, validDecimal, 'abc', 'xyz'),
      getPeriodDaysFromToday(periodeForGradering, validDecimal, -20, -15)]);
    const errorsWithValidDates = PermisjonGraderingPanel.validate([getPeriodDaysFromToday(periodeForGradering, validDecimal, -10, -5),
      getPeriodDaysFromToday(periodeForGradering, validDecimal, -20, -15)]);

    expect(errorsWithInvalidDates).to.be.an('array');
    expect(errorsWithInvalidDates[0].periodeFom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[0].periodeTom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[1]).to.not.exist;

    expect(errorsWithValidDates).to.not.exist;
  });

  it('skal validere at ingen perioder overlapper', () => {
    const errorsWithInvalidDates = PermisjonGraderingPanel.validate([getPeriodDaysFromToday(periodeForGradering, validDecimal, -20, -15),
      getPeriodDaysFromToday(periodeForGradering, validDecimal, -16, -11)]);
    const errorsWithValidDates = PermisjonGraderingPanel.validate([getPeriodDaysFromToday(periodeForGradering, validDecimal, -20, -15),
      getPeriodDaysFromToday(periodeForGradering, validDecimal, -14, -10)]);

    expect(errorsWithInvalidDates).to.be.an('object');
    // eslint-disable-next-line no-underscore-dangle
    expect(errorsWithInvalidDates._error).to.be.an('array').that.eql(dateRangesOverlappingMessage());

    expect(errorsWithValidDates).to.not.exist;
  });
});
