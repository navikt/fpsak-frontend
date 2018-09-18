import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import aksjonspunktType from 'kodeverk/aksjonspunktType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingspunktInfoPanel from 'behandlingsprosess/components/BehandlingspunktInfoPanel';
import { BehandlingsprosessIndex } from './BehandlingsprosessIndex';

describe('<BehandlingsprosessIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(12345, 2);

  it('skal bekrefte ett aksjonspunkt', () => {
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

    const stub = sinon.stub().resolves('success');

    const wrapper = shallow(<BehandlingsprosessIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      aksjonspunkter={aksjonspunkter}
      behandlingspunkter={[]}
      selectedBehandlingspunkt={null}
      resetBehandlingspunkter={sinon.spy()}
      location={{ pathname: 'test' }}
      push={sinon.spy()}
      resolveProsessAksjonspunkter={stub}
      overrideProsessAksjonspunkter={sinon.spy()}
      fetchPreview={sinon.spy()}
      fetchVedtaksbrevPreview={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      haveSentVarsel
    />);

    const panel = wrapper.find(BehandlingspunktInfoPanel);
    expect(panel).to.have.length(1);

    const aksjonspunktValues = [{
      test: 'verdi1',
      kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
    }];
    panel.prop('submitCallback')(aksjonspunktValues);

    expect(stub).to.have.property('callCount', 1);
    const { args } = stub.getCalls()[0];
    expect(args).to.have.length(3);
    const models = args[1];

    expect(models).to.eql({
      behandlingId: 2,
      saksnummer: '12345',
      behandlingVersjon: 123,
      bekreftedeAksjonspunktDtoer: [{
        '@type': '5007',
        kode: '5007',
        test: 'verdi1',
      }],
    });
  });

  it('skal bekrefte to aksjonspunkter', () => {
    const toAksjonspunkter = [
      {
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
      }, {
        id: 1,
        definisjon: {
          navn: 'Omsorg',
          kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
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

    const stub = sinon.stub().resolves('success');

    const wrapper = shallow(<BehandlingsprosessIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      aksjonspunkter={toAksjonspunkter}
      behandlingspunkter={[]}
      selectedBehandlingspunkt={null}
      resetBehandlingspunkter={sinon.spy()}
      location={{ pathname: 'test' }}
      push={sinon.spy()}
      resolveProsessAksjonspunkter={stub}
      overrideProsessAksjonspunkter={sinon.spy()}
      fetchPreview={sinon.spy()}
      fetchVedtaksbrevPreview={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      haveSentVarsel
    />);

    const panel = wrapper.find(BehandlingspunktInfoPanel);
    expect(panel).to.have.length(1);

    const aksjonspunktValues = [{
      test: 'verdi1',
      kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
    }, {
      test: 'verdi1',
      kode: aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET,
    }];
    panel.prop('submitCallback')(aksjonspunktValues);

    expect(stub).to.have.property('callCount', 1);
    const { args } = stub.getCalls()[0];
    expect(args).to.have.length(3);
    const models = args[1];
    expect(models).to.eql({
      behandlingId: 2,
      saksnummer: '12345',
      behandlingVersjon: 123,
      bekreftedeAksjonspunktDtoer: [{
        '@type': '5007',
        kode: '5007',
        test: 'verdi1',
      }, {
        '@type': '5011',
        kode: '5011',
        test: 'verdi1',
      }],
    });
  });
});
