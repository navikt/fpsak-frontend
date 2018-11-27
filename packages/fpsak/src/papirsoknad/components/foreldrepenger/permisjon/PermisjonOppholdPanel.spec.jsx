import { expect } from 'chai';
import moment from 'moment';

import { ISO_DATE_FORMAT } from 'utils/formats';
import { dateRangesOverlappingMessage, invalidDateMessage } from 'utils/validation/messages';
import { PermisjonOppholdPanel } from './PermisjonOppholdPanel';

describe('<PermisjonOppholdPanel>', () => {
  const getPeriodDaysFromToday = (startDaysFromToday, endDaysFromToday) => ({
    periodeFom: moment().add(startDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    periodeTom: moment().add(endDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    årsak: 'TEST',
  });

  const getPeriod = (periodeFom, periodeTom) => ({
    periodeFom,
    periodeTom,
    årsak: 'TEST',
  });

  it('skal validere at alle perioder har gyldige datoer', () => {
    const errorsWithInvalidDates = PermisjonOppholdPanel.validate([getPeriod('abc', 'xyz'), getPeriodDaysFromToday(-20, -15)]);
    const errorsWithValidDates = PermisjonOppholdPanel.validate([getPeriodDaysFromToday(-10, -5), getPeriodDaysFromToday(-20, -15)]);

    expect(errorsWithInvalidDates).to.be.an('array');
    expect(errorsWithInvalidDates[0].periodeFom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[0].periodeTom).to.be.an('array').that.eql(invalidDateMessage());
    expect(errorsWithInvalidDates[1]).to.not.exist;

    expect(errorsWithValidDates).to.not.exist;
  });

  it('skal validere at ingen perioder overlapper', () => {
    const errorsWithInvalidDates = PermisjonOppholdPanel.validate([getPeriodDaysFromToday(-20, -15), getPeriodDaysFromToday(-16, -11)]);
    const errorsWithValidDates = PermisjonOppholdPanel.validate([getPeriodDaysFromToday(-20, -15), getPeriodDaysFromToday(-14, -10)]);

    expect(errorsWithInvalidDates).to.be.an('object');
    // eslint-disable-next-line no-underscore-dangle
    expect(errorsWithInvalidDates._error).to.be.an('array').that.eql(dateRangesOverlappingMessage());

    expect(errorsWithValidDates).to.not.exist;
  });
});
