import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import HenlagtBehandlingModal from './HenlagtBehandlingModal';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-meny';

describe('<HenlagtBehandlingModal>', () => {
  it('skal rendre åpen modal', () => {
    const wrapper = shallowWithIntl(<HenlagtBehandlingModal.WrappedComponent
      showModal
      closeEvent={sinon.spy()}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen er henlagt');

    const okKnapp = modal.find('Hovedknapp');
    expect(okKnapp).to.have.length(1);
    expect(okKnapp.prop('mini')).is.true;
    expect(okKnapp.childAt(0).text()).is.eql('OK');
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<HenlagtBehandlingModal.WrappedComponent
      showModal={false}
      closeEvent={sinon.spy()}
      intl={intlMock}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.false;
  });
});
