import React from 'react';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { SoknadRegistrertModal } from './SoknadRegistrertModal';

describe('<SoknadRegistrertModal>', () => {
  it('skal vise modal for registrert søknad', () => {
    const wrapper = shallowWithIntl(<SoknadRegistrertModal
      isOpen
      intl={intlMock}
    />);

    expect(wrapper.find(Modal).prop('isOpen')).is.true;
    expect(wrapper.find('AlertStripeSuksess')).to.have.length(1);
    expect(wrapper.find('Hovedknapp')).to.have.length(1);
  });
});
