import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { FatterVedtakStatusModal } from './FatterVedtakStatusModal';

describe('<FatterVedtakStatusModal>', () => {
  const closeEventCallback = sinon.spy();
  const aksjonspunkter = [{
    id: 0,
    definisjon: {
      navn: 'Søknadsfrist',
      kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
    },
    status: {
      navn: 'Opprettet',
      kode: '',
    },
    kanLoses: true,
    aksjonspunktType: {
      navn: 'AUTOPUNKT',
      kode: aksjonspunktType.AUTOPUNKT,
    },
    erAktivt: true,
  },
  ];

  it('skal rendre modal for fatter vedtak', () => {
    const wrapper = shallowWithIntl(<FatterVedtakStatusModal
      intl={intlMock}
      showModal
      aksjonspunkter={aksjonspunkter}
      behandlingType={{
        kode: behandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      }}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        navn: 'FORELDREPENGER',
      }}
      behandlingStatus={{
        kode: behandlingStatus.OPPRETTET,
        navn: 'OPPRETTET',
      }}
      closeEvent={closeEventCallback}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('contentLabel')).is.eql('Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.');

    const button = wrapper.find(Hovedknapp);
    expect(button).to.have.length(1);
  });
});
