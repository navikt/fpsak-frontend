import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import Modal from 'sharedComponents/Modal';
import { FatterVedtakStatusModal } from './FatterVedtakStatusModal';

describe('<FatterVedtakStatusModal>', () => {
  const closeEventCallback = sinon.spy();
  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(<FatterVedtakStatusModal
      intl={intlMock}
      showModal
      infoTextCode="testInfo"
      altImgTextCode="testAlt"
      modalDescriptionTextCode="FatterVedtakStatusModal.ModalDescription"
      closeEvent={closeEventCallback}
      resolveProsessAksjonspunkterSuccess
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });
});
