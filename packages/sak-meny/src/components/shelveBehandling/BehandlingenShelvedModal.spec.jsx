import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import BehandlingenShelvedModal from './BehandlingenShelvedModal';

describe('<BehandlingenShelvedModal>', () => {
  it('skal rendre åpen modal', () => {
    const wrapper = shallowWithIntl(<BehandlingenShelvedModal.WrappedComponent
      showModal
      closeEvent={sinon.spy()}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('BehandlingenShelvedModal.ModalDescription');

    const okKnapp = modal.find('Hovedknapp');
    expect(okKnapp).to.have.length(1);
    expect(okKnapp.prop('mini')).is.true;
    expect(okKnapp.childAt(0).text()).is.eql('BehandlingenShelvedModal.Ok');
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<BehandlingenShelvedModal.WrappedComponent
      showModal={false}
      closeEvent={sinon.spy()}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.false;
  });
});
