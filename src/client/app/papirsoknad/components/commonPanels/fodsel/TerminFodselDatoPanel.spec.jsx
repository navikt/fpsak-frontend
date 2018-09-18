import React from 'react';
import { expect } from 'chai';
import moment from 'moment';

import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { ISO_DATE_FORMAT } from 'utils/formats';
import TerminFodselDatoPanel, { TerminFodselDatoPanelImpl } from './TerminFodselDatoPanel';

const now = moment();
const dateStringLastYear = moment(now).subtract(1, 'years').format(ISO_DATE_FORMAT);
const dateToday = moment(now).format(ISO_DATE_FORMAT);
const dateStringNextYear = moment(now).add(1, 'years').format(ISO_DATE_FORMAT);

describe('<TerminFodselDatoPanel>', () => {
  it('skal ikke vise inputs for fødselsdato eller termindato når ingen valgt er gjort', () => {
    const wrapper = shallowWithIntl(<TerminFodselDatoPanelImpl
      intl={intlMock}
      readOnly={false}
      erBarnetFodt={undefined}
    />);

    expect(wrapper.find({ name: 'terminbekreftelseDato' })).to.have.length(0);
    expect(wrapper.find({ name: 'foedselsDato' })).to.have.length(0);
  });

  it('skal vise inputs for fødselsdato når barnet er født', () => {
    const wrapper = shallowWithIntl(<TerminFodselDatoPanelImpl
      intl={intlMock}
      readOnly={false}
      erBarnetFodt
    />);

    expect(wrapper.find({ name: 'terminbekreftelseDato' })).to.have.length(0);
    expect(wrapper.find({ name: 'foedselsDato' })).to.have.length(1);
  });

  it('skal vise inputs for termindato når barnet ikke er født', () => {
    const wrapper = shallowWithIntl(<TerminFodselDatoPanelImpl
      intl={intlMock}
      readOnly={false}
      erBarnetFodt={false}
    />);

    expect(wrapper.find({ name: 'terminbekreftelseDato' })).to.have.length(1);
    expect(wrapper.find({ name: 'foedselsDato' })).to.have.length(0);
  });

  describe('validate', () => {
    const { validate } = TerminFodselDatoPanel;

    it('skal validere at termindato er gyldig og etter tidligst for tre uker siden', () => {
      const dateThreeWeeksAndOneDayAgo = moment().startOf('day').subtract(3, 'weeks').subtract(1, 'days')
        .format(ISO_DATE_FORMAT);
      const dateThreeWeeksAgo = moment().startOf('day').subtract(3, 'weeks').format(ISO_DATE_FORMAT);
      const errorsInvalidDate = validate({ termindato: 'blabla' });
      const errorsValidDateThreeWeeksAndOneDayAgo = validate({ termindato: dateThreeWeeksAndOneDayAgo });
      const errorsValidDateThreeWeeksAgo = validate({ termindato: dateThreeWeeksAgo });

      expect(errorsInvalidDate.termindato).to.be.an('array');
      expect(errorsValidDateThreeWeeksAndOneDayAgo.termindato).to.be.null;
      expect(errorsValidDateThreeWeeksAgo.termindato).to.be.null;
    });

    it('skal validere at terminbekreftelsesdato er gyldig', () => {
      const errorsInvalidDate = validate({ terminbekreftelseDato: 'blabla', termindato: dateStringNextYear });
      const errorsValidDateLastYear = validate({ terminbekreftelseDato: dateStringLastYear, termindato: dateStringNextYear });

      expect(errorsInvalidDate.terminbekreftelseDato).to.be.an('array');
      expect(errorsValidDateLastYear.terminbekreftelseDato).to.be.null;
    });

    it('skal validere at terminbekreftelsesdato er før eller lik dagens dato', () => {
      const errorsDateNextYear = validate({ terminbekreftelseDato: dateStringNextYear, termindato: dateStringNextYear });
      const errorsDateLastYear = validate({ terminbekreftelseDato: dateStringLastYear, termindato: dateStringNextYear });

      expect(errorsDateNextYear.terminbekreftelseDato).to.be.an('array');
      expect(errorsDateLastYear.terminbekreftelseDato).to.be.null;
    });

    it('skal validere at terminbekreftelsesdato er før termindato', () => {
      const today = moment().startOf('day').format(ISO_DATE_FORMAT);
      const yesterday = moment().startOf('day').subtract(1, 'day').format(ISO_DATE_FORMAT);
      const dayBeforeYesterday = moment().startOf('day').subtract(2, 'day').format(ISO_DATE_FORMAT);
      const errorsDateAfterTermindato = validate({ termindato: yesterday, terminbekreftelseDato: today });
      const errorsSameDateAsTermindato = validate({ termindato: yesterday, terminbekreftelseDato: yesterday });
      const errorsDateBeforeTermindato = validate({ termindato: yesterday, terminbekreftelseDato: dayBeforeYesterday });

      expect(errorsDateAfterTermindato.terminbekreftelseDato).to.be.an('array');
      expect(errorsSameDateAsTermindato.terminbekreftelseDato).to.be.an('array');
      expect(errorsDateBeforeTermindato.terminbekreftelseDato).to.be.null;
    });

    it('skal validere at antall barn fra terminbekreftelse er et gyldig heltall større enn 0', () => {
      const errorsNoAntallBarn = validate({ termindato: dateStringNextYear });
      const errorsInvalidAntallBarn = validate({ antallBarnFraTerminbekreftelse: 'femti', termindato: dateStringNextYear });
      const errorsAntallBarnLessThanOne = validate({ antallBarnFraTerminbekreftelse: 0, termindato: dateStringNextYear });
      const errorsValidAntallBarn = validate({ antallBarnFraTerminbekreftelse: 1, termindato: dateStringNextYear });

      expect(errorsNoAntallBarn.antallBarnFraTerminbekreftelse).to.be.an('array');
      expect(errorsInvalidAntallBarn.antallBarnFraTerminbekreftelse).to.be.an('array');
      expect(errorsAntallBarnLessThanOne.antallBarnFraTerminbekreftelse).to.be.an('array');
      expect(errorsValidAntallBarn.antallBarnFraTerminbekreftelse).to.be.null;
    });

    it('skal validere at fødselsdato er gyldig og før eller lik dagens dato', () => {
      const dateStringTomorrow = moment().add(1, 'day').startOf('day').format(ISO_DATE_FORMAT);
      const errorsInvalidDate = validate({ erBarnetFodt: true, foedselsDato: 'blabla' });
      const errorsValidDateNextYear = validate({ erBarnetFodt: true, foedselsDato: dateStringTomorrow });
      const errorsValidDateToday = validate({ erBarnetFodt: true, foedselsDato: dateToday });

      expect(errorsInvalidDate.foedselsDato).to.be.an('array');
      expect(errorsValidDateNextYear.foedselsDato).to.be.an('array');
      expect(errorsValidDateToday.foedselsDato).to.be.an('array');
    });


    it('skal validere at antall barn født er et gyldig heltall større enn 0', () => {
      const errorsNoAntallBarn = validate({ erBarnetFodt: true, foedselsDato: dateStringNextYear });
      const errorsInvalidAntallBarn = validate({ erBarnetFodt: true, antallBarn: 'femti', foedselsDato: dateStringNextYear });
      const errorsAntallBarnLessThanOne = validate({ erBarnetFodt: true, antallBarn: 0, foedselsDato: dateStringNextYear });
      const errorsValidAntallBarn = validate({ erBarnetFodt: true, antallBarn: 1, foedselsDato: dateStringNextYear });

      expect(errorsNoAntallBarn.antallBarn).to.be.an('array');
      expect(errorsInvalidAntallBarn.antallBarn).to.be.an('array');
      expect(errorsAntallBarnLessThanOne.antallBarn).to.be.an('array');
      expect(errorsValidAntallBarn.antallBarn).to.be.null;
    });
  });
});
