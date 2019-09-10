import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';

import { Hovedknapp } from 'nav-frontend-knapper';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import IverksetterVedtakStatusModal from './IverksetterVedtakStatusModal';

describe('<IverksetterVedtakStatusModal>', () => {
  it('skal rendre modal', () => {
    const closeEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<IverksetterVedtakStatusModal.WrappedComponent
      intl={intlMock}
      behandlingType={{ kode: BehandlingType.FORSTEGANGSSOKNAD }}
      fagsakYtelseType={{ kode: FagsakYtelseType.FORELDREPENGER }}
      closeEvent={closeEventCallback}
      behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
      resolveProsessAksjonspunkterSuccess
      resolveFaktaAksjonspunkterSuccess
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Engangsstønaden er innvilget. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });
});
