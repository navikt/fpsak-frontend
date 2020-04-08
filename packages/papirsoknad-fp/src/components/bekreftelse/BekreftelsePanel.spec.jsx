import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-papirsoknad-fp';
import { BekreftelsePanel } from './BekreftelsePanel';

describe('<BekreftelsePanel>', () => {
  describe('Foreldrepenger-søknad', () => {
    it('skal vise radioknapper for om annen foreldre er kjent med perioder det er søkt om', () => {
      const wrapper = shallowWithIntl(<BekreftelsePanel
        intl={intlMock}
        readOnly={false}
        annenForelderInformertRequired
      />);
      expect(wrapper.find({ name: 'annenForelderInformert' })).to.have.length(1);
    });
  });
});
