import React from 'react';
import { expect } from 'chai';
import moment from 'moment';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

import { DatepickerField } from '@fpsak-frontend/form';
import TerminFodselSvpPanel from './TerminFodselSvpPanel';

describe('<TerminFodselSvpPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const wrapper = shallowWithIntl(<TerminFodselSvpPanel.WrappedComponent
      intl={intlMock}
      readOnly={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(2);
  });

  it('skal validere at fødselsdato er gyldig og er før eller lik dagens dato', () => {
    const { validate } = TerminFodselSvpPanel.WrappedComponent;
    const dateToday = moment().format(ISO_DATE_FORMAT);
    const dateStringTomorrow = moment().add(1, 'day').startOf('day').format(ISO_DATE_FORMAT);
    const errorsInvalidDate = validate({ foedselsDato: 'blabla' });
    const errorsValidDateNextYear = validate({ foedselsDato: dateStringTomorrow });
    const errorsValidDateToday = validate({ foedselsDato: dateToday });

    expect(errorsInvalidDate.foedselsDato).to.be.an('array');
    expect(errorsValidDateNextYear.foedselsDato).to.be.an('array');
    expect(errorsValidDateToday.foedselsDato).to.be.null;
  });
});
