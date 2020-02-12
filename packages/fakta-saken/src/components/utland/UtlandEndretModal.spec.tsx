import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-fakta-saken';
import UtlandEndretModal from './UtlandEndretModal';

describe('<UtlandEndretModal>', () => {
  it('skal vise rendre komponent korrekt og utføre klikk på knapp', () => {
    const lagreOgLukk = sinon.spy();

    const wrapper = shallowWithIntl(<UtlandEndretModal.WrappedComponent
      intl={intlMock}
      visModal
      lagreOgLukk={lagreOgLukk}
    />);

    const knapp = wrapper.find(Hovedknapp);
    expect(knapp).to.have.length(1);

    knapp.prop('onClick')();

    expect(lagreOgLukk.getCalls()).to.have.length(1);
  });
});
