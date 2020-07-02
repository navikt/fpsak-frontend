import React from 'react';
import moment from 'moment';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import {
  dateNotAfterOrEqualMessage,
  dateNotBeforeOrEqualMessage,
  dateRangesOverlappingMessage,
  invalidDateMessage,
  ISO_DATE_FORMAT,
  isRequiredMessage,
} from '@fpsak-frontend/utils';

import SoknadData from '../SoknadData';
import OppholdINorgePanel, { OppholdINorgePanelImpl } from './OppholdINorgePanel';

describe('<OppholdINorgePanel>', () => {
  const countryCodes = [
    {
      kode: 'NOR',
      navn: 'Norge',
    },
    {
      kode: 'SWE',
      navn: 'Sverige',
    },
  ];

  describe('validate', () => {
    it('skal validere at opphold i Norge nå er besvart', () => {
      const errorsWithUndefinedOppholdINorge = OppholdINorgePanel.validate({});
      const errorsWithOppholdINorgeTrue = OppholdINorgePanel.validate({ oppholdINorge: true });
      const errorsWithOppholdINorgeFalse = OppholdINorgePanel.validate({ oppholdINorge: false });

      expect(errorsWithUndefinedOppholdINorge.oppholdINorge).to.be.an('array').that.eql(isRequiredMessage());
      expect(errorsWithOppholdINorgeTrue.oppholdINorge).to.not.exist;
      expect(errorsWithOppholdINorgeFalse.oppholdINorge).to.not.exist;
    });

    it('skal validere at tidligere opphold utenlands er besvart', () => {
      const errorsWithUndefinedHarTidligereOppholdUtenlands = OppholdINorgePanel.validate({});
      const errorsWithHarTidligereOppholdUtenlandsTrue = OppholdINorgePanel.validate({ harTidligereOppholdUtenlands: true });
      const errorsWithHarTidligereOppholdUtenlandsFalse = OppholdINorgePanel.validate({ harTidligereOppholdUtenlands: false });

      expect(errorsWithUndefinedHarTidligereOppholdUtenlands.harTidligereOppholdUtenlands).to.be.an('array').that.eql(isRequiredMessage());
      expect(errorsWithHarTidligereOppholdUtenlandsTrue.harTidligereOppholdUtenlands).to.not.exist;
      expect(errorsWithHarTidligereOppholdUtenlandsFalse.harTidligereOppholdUtenlands).to.not.exist;
    });

    it('skal validere at fremtidige opphold utenlands er besvart', () => {
      const errorsWithUndefinedHarFremtidigeOppholdUtenlands = OppholdINorgePanel.validate({});
      const errorsWithHarFremtidigeOppholdUtenlandsTrue = OppholdINorgePanel.validate({ harFremtidigeOppholdUtenlands: true });
      const errorsWithHarFremtidigeOppholdUtenlandsFalse = OppholdINorgePanel.validate({ harFremtidigeOppholdUtenlands: false });

      expect(errorsWithUndefinedHarFremtidigeOppholdUtenlands.harFremtidigeOppholdUtenlands).to.be.an('array').that.eql(isRequiredMessage());
      expect(errorsWithHarFremtidigeOppholdUtenlandsTrue.harFremtidigeOppholdUtenlands).to.not.exist;
      expect(errorsWithHarFremtidigeOppholdUtenlandsFalse.harFremtidigeOppholdUtenlands).to.not.exist;
    });

    const getPeriodDaysFromToday = (startDaysFromToday, endDaysFromToday) => ({
      land: countryCodes[1].kode,
      periodeFom: moment().add(startDaysFromToday, 'days').format(ISO_DATE_FORMAT),
      periodeTom: moment().add(endDaysFromToday, 'days').format(ISO_DATE_FORMAT),
    });
    const getPeriod = (periodeFom, periodeTom) => ({ land: countryCodes[1].kode, periodeFom, periodeTom });

    describe('hvis har tidligere utenlandsopphold', () => {
      it('skal validere at alle perioder har gyldige datoer', () => {
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [getPeriod('abc', 'xyz'), getPeriodDaysFromToday(-20, -15)],
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [
            getPeriodDaysFromToday(-10, -5),
            getPeriodDaysFromToday(-20, -15),
          ],
        });

        expect(errorsWithInvalidDates.tidligereOppholdUtenlands).to.be.an('array');
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[0].periodeFom).to.be.an('array').that.eql(invalidDateMessage());
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[0].periodeTom).to.be.an('array').that.eql(invalidDateMessage());
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[1]).to.not.exist;

        expect(errorsWithValidDates.tidligereOppholdUtenlands).to.not.exist;
      });

      it('skal validere at alle datoer er før eller lik dagens dato', () => {
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [getPeriodDaysFromToday(-20, -15), getPeriodDaysFromToday(-1, +1)],
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [
            getPeriodDaysFromToday(-10, -5),
            getPeriodDaysFromToday(-20, -15),
          ],
        });

        expect(errorsWithInvalidDates.tidligereOppholdUtenlands).to.be.an('array');
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[1].periodeFom).to.not.exist;
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[1].periodeTom).to.be.an('array');
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands[1].periodeTom[0].id).to.eql(dateNotBeforeOrEqualMessage()[0].id);

        expect(errorsWithValidDates.tidligereOppholdUtenlands).to.not.exist;
      });

      it('skal validere at ingen perioder overlapper', () => {
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [getPeriodDaysFromToday(-20, -15), getPeriodDaysFromToday(-16, -11)],
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harTidligereOppholdUtenlands: true,
          tidligereOppholdUtenlands: [getPeriodDaysFromToday(-20, -15), getPeriodDaysFromToday(-14, -10)],
        });

        expect(errorsWithInvalidDates.tidligereOppholdUtenlands).to.be.an('object');
        // eslint-disable-next-line no-underscore-dangle
        expect(errorsWithInvalidDates.tidligereOppholdUtenlands._error).to.be.an('array').that.eql(dateRangesOverlappingMessage());

        expect(errorsWithValidDates.tidligereOppholdUtenlands).to.not.exist;
      });
    });

    describe('hvis har fremtidige utenlandsopphold', () => {
      it('skal validere at alle perioder har gyldige datoer', () => {
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [getPeriod('abc', 'xyz'), getPeriodDaysFromToday(15, 20)],
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [
            getPeriodDaysFromToday(5, 10),
            getPeriodDaysFromToday(15, 20),
          ],
        });

        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands).to.be.an('array');
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[0].periodeFom).to.be.an('array').that.eql(invalidDateMessage());
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[0].periodeTom).to.be.an('array').that.eql(invalidDateMessage());
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[1]).to.not.exist;

        expect(errorsWithValidDates.fremtidigeOppholdUtenlands).to.not.exist;
      });

      it('skal validere at alle datoer er lik eller etter mottatt dato', () => {
        const periode = {
          land: countryCodes[1].kode,
          periodeFom: '2019-01-01',
          periodeTom: '2019-05-01',
        };
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [periode],
          mottattDato: '2019-02-01',
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [periode],
          mottattDato: '2019-01-01',
        });

        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands).to.be.an('array');
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[0].periodeTom).to.not.exist;
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[0].periodeFom).to.be.an('array');
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands[0].periodeFom[0].id).to.eql(dateNotAfterOrEqualMessage()[0].id);

        expect(errorsWithValidDates.fremtidigeOppholdUtenlands).to.not.exist;
      });

      it('skal validere at ingen perioder overlapper', () => {
        const errorsWithInvalidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [getPeriodDaysFromToday(15, 20), getPeriodDaysFromToday(11, 16)],
        });
        const errorsWithValidDates = OppholdINorgePanel.validate({
          harFremtidigeOppholdUtenlands: true,
          fremtidigeOppholdUtenlands: [getPeriodDaysFromToday(15, 20), getPeriodDaysFromToday(10, 14)],
        });

        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands).to.be.an('object');
        // eslint-disable-next-line no-underscore-dangle
        expect(errorsWithInvalidDates.fremtidigeOppholdUtenlands._error).to.be.an('array').that.eql(dateRangesOverlappingMessage());

        expect(errorsWithValidDates.fremtidigeOppholdUtenlands).to.not.exist;
      });
    });
  });

  it('skal vise tidligere utenlandsopphold hvis harTidligereOppholdUtenlands er valgt', () => {
    const wrapper = shallowWithIntl(<OppholdINorgePanelImpl
      intl={intlMock}
      countryCodes={countryCodes}
      form="test"
      soknadData={new SoknadData('TEST', 'TEST', 'TEST', [])}
    />);

    let tidligreOppholdUtenlands = wrapper.find({ name: 'tidligereOppholdUtenlands' });
    expect(tidligreOppholdUtenlands).to.have.length(0);

    wrapper.setProps({ harTidligereOppholdUtenlands: true });
    wrapper.update();

    tidligreOppholdUtenlands = wrapper.find({ name: 'tidligereOppholdUtenlands' });
    expect(tidligreOppholdUtenlands).to.have.length(1);
  });

  it('skal vise land dropdown, datepicker og knappen hvis harFremtidigeOppholdUtenlands er valgt', () => {
    const wrapper = shallowWithIntl(<OppholdINorgePanelImpl
      intl={intlMock}
      countryCodes={countryCodes}
      form="test"
      soknadData={new SoknadData('TEST', 'TEST', 'TEST', [])}
    />);

    let fremtidigeOppholdUtenlands = wrapper.find({ name: 'fremtidigeOppholdUtenlands' });
    expect(fremtidigeOppholdUtenlands).to.have.length(0);

    wrapper.setProps({ harFremtidigeOppholdUtenlands: true });
    wrapper.update();

    fremtidigeOppholdUtenlands = wrapper.find({ name: 'fremtidigeOppholdUtenlands' });
    expect(fremtidigeOppholdUtenlands).to.have.length(1);
  });
});
