import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import Modal from 'sharedComponents/Modal';
import { FatterVedtakApprovalModal } from './FatterVedtakApprovalModal';

describe('<FatterVedtakApprovalModal>', () => {
  const closeEventCallback = sinon.spy();
  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(<FatterVedtakApprovalModal
      intl={intlMock}
      showModal
      infoTextCode="testInfo"
      altImgTextCode="testAlt"
      modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescription"
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

  it('skal rendre modal for iverksetter vedtak', () => {
    const wrapper = shallowWithIntl(<FatterVedtakApprovalModal
      intl={intlMock}
      showModal
      infoTextCode="testInfo"
      altImgTextCode="testAlt"
      modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionESApproval"
      closeEvent={closeEventCallback}
      resolveProsessAksjonspunkterSuccess
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Engangsstønad er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });

  it('skal rendre modal for iverksetter vedtak foreldrepenger', () => {
    const wrapper = shallowWithIntl(<FatterVedtakApprovalModal
      intl={intlMock}
      showModal
      infoTextCode="testInfo"
      altImgTextCode="testAlt"
      modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionFPApproval"
      closeEvent={closeEventCallback}
      resolveProsessAksjonspunkterSuccess
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Foreldrepenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });

  it('skal lukke modal ved trykk på knapp', () => {
    const wrapper = shallowWithIntl(<FatterVedtakApprovalModal
      intl={intlMock}
      showModal={false}
      infoTextCode="testInfo"
      altImgTextCode="testAlt"
      modalDescriptionTextCode="FatterVedtakApprovalModal.ModalDescriptionFPApproval"
      closeEvent={closeEventCallback}
      resolveProsessAksjonspunkterSuccess
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;

    const button = wrapper.find(Hovedknapp);
    expect(closeEventCallback).to.have.property('callCount', 0);
    button.simulate('click');
    expect(closeEventCallback).to.have.property('callCount', 1);
  });
});
