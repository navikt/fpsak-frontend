import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { SoknadRegistrertModal } from './SoknadRegistrertModal';

describe('<SoknadRegistrertModal>', () => {
  it('skal vise modal for registrert søknad', () => {
    const wrapper = shallowWithIntl(<SoknadRegistrertModal
      isOpen
      onRequestClose={sinon.spy()}
      intl={intlMock}
    />);

    expect(wrapper.find('Modal').prop('isOpen')).is.true;
    expect(wrapper.find('AlertStripeSuksess')).to.have.length(1);
    expect(wrapper.find('Hovedknapp')).to.have.length(1);
  });
});
