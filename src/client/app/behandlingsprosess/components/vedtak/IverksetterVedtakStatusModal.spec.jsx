import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import behandlingStatus from 'kodeverk/behandlingStatus';
import IverksetterVedtakStatusModal from './IverksetterVedtakStatusModal';

describe('<IverksetterVedtakStatusModal>', () => {
  const behandling = {
    id: 1,
    versjon: 123,
    type: {
      kode: 'BT-002',
      navn: '',
    },
    status: {
      kode: behandlingStatus.IVERKSETTER_VEDTAK,
      navn: 'test',
    },
    aksjonspunkter: [],
    fagsakId: 1,
    opprettet: '15.10.2017',
    vilkar: [{
      vilkarType: {
        kode: '1',
        navn: 'test',
      },
      avslagKode: '2',
      lovReferanse: '§ 22-13, 2. ledd',
    }],
  };

  it('skal rendre modal', () => {
    const closeEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<IverksetterVedtakStatusModal.WrappedComponent
      intl={intlMock}
      closeEvent={closeEventCallback}
      selectedBehandling={behandling}
      behandlingStatusKode={behandlingStatus.IVERKSETTER_VEDTAK}
      isSameResultAsOriginalBehandling
      resolveProsessAksjonspunkterSuccess
      resolveFaktaAksjonspunkterSuccess
      behandlinger={[behandling]}
      modalTextId="IverksetterVedtakStatusModal.AvslattOgIverksattES"
    />);

    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Engangsstønaden er innvilget. Du kommer nå til forsiden.');

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(1);
  });
});
