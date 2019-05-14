import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';

import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import FatterTilbakekrevingVedtakStatusModal from './FatterTilbakekrevingVedtakStatusModal';

describe('<FatterTilbakekrevingVedtakStatusModal>', () => {
  const closeEventCallback = sinon.spy();
  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(<FatterTilbakekrevingVedtakStatusModal.WrappedComponent
      intl={intlMock}
      showModal
      closeEvent={closeEventCallback}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Forslag til vedtak er sendt til beslutter');
  });
});
