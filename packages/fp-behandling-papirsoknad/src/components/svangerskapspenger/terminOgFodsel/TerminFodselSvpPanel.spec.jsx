import React from 'react';
import { expect } from 'chai';
import moment from 'moment';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import TerminFodselSvpPanel from './TerminFodselSvpPanel';

describe('<TerminFodselSvpPanel>', () => {
  it('skal vise inputs for termindato når barnet ikke er født', () => {
    const wrapper = shallowWithIntl(<TerminFodselSvpPanel
      readOnly={false}
    />);

    expect(wrapper.find({ name: 'terminbekreftelseDato' })).to.have.length(1);
    expect(wrapper.find({ name: 'foedselsDato' })).to.have.length(0);
  });

  describe('validate', () => {
    const { validate } = TerminFodselSvpPanel;

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
  });
});
