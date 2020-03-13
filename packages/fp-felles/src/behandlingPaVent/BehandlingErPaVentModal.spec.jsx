import React from 'react';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';

import SettBehandlingPaVentForm from './SettBehandlingPaVentForm';
import BehandlingErPaVentModal from './BehandlingErPaVentModal';

describe('<BehandlingErPaVentModal>', () => {
  it('skal vise form-modal når en har behandlingsid', () => {
    const wrapper = shallowWithIntl(<BehandlingErPaVentModal.WrappedComponent
      showModal
      closeEvent={sinon.spy()}
      behandlingId={1234}
      intl={intlMock}
      handleOnHoldSubmit={sinon.spy()}
      hasManualPaVent
      ventearsaker={[]}
      isReadOnly={false}
    />);

    expect(wrapper.find(SettBehandlingPaVentForm)).to.have.length(1);
    expect(wrapper.find(Modal)).to.have.length(0);
  });

  it('skal vise readonly-modal når en ikke har behandlingsid', () => {
    const wrapper = shallowWithIntl(<BehandlingErPaVentModal.WrappedComponent
      showModal
      closeEvent={sinon.spy()}
      intl={intlMock}
      handleOnHoldSubmit={sinon.spy()}
      hasManualPaVent
      ventearsaker={[]}
      isReadOnly={false}
    />);

    expect(wrapper.find(SettBehandlingPaVentForm)).to.have.length(0);
    expect(wrapper.find(Modal)).to.have.length(1);
  });
});
