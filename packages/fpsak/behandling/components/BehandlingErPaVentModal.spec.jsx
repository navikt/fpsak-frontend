import React from 'react';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import BehandlingErPaVentModal from './BehandlingErPaVentModal';

describe('<BehandlingErPaVentModal>', () => {
  it('skal vise endre ventefrist når NAV-ansatt har rettigheter', () => {
    const wrapper = shallowWithIntl(<BehandlingErPaVentModal.WrappedComponent
      showModal
      closeEvent={sinon.spy()}
      behandlingId={1234}
      intl={intlMock}
      handleOnHoldSubmit={sinon.spy()}
      hasManualPaVent
    />);

    const ventForm = wrapper.find('Connect(ReduxForm)');
    expect(ventForm).to.have.length(1);
  });
});
