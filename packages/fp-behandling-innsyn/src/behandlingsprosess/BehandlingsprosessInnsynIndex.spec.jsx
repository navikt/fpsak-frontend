import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import BehandlingspunktInnsynInfoPanel from 'behandlingInnsyn/src/behandlingsprosess/components/BehandlingspunktInnsynInfoPanel';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingsprosessInnsynIndex } from './BehandlingsprosessInnsynIndex';

describe('<BehandlingsprosessInnsynIndex>', () => {
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

    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      aksjonspunkter={aksjonspunkter}
      behandlingspunkter={[]}
      selectedBehandlingspunkt={null}
      resetBehandlingspunkter={sinon.spy()}
      location={{ pathname: 'test' }}
      push={sinon.spy()}
      resolveProsessAksjonspunkter={stub}
      fetchPreview={sinon.spy()}
      fetchVedtaksbrevPreview={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      haveSentVarsel
      behandlingType={{
        kode: BehandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      }}
      isSelectedBehandlingHenlagt={false}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        navn: 'FORELDREPENGER',
      }}
      behandlingStatus={{
        kode: behandlingStatus.OPPRETTET,
        navn: 'OPPRETTET',
      }}
      resolveProsessAksjonspunkterSuccess
      resolveFaktaAksjonspunkterSuccess
      behandlingsresultat={{
        kode: 'test',
        navn: 'test',
      }}
    />);

    const panel = wrapper.find(BehandlingspunktInnsynInfoPanel);
    expect(panel).to.have.length(1);

    const aksjonspunktValues = [{
      test: 'verdi1',
      kode: aksjonspunktCodes.SOKNADSFRISTVILKARET,
    }];
    panel.prop('submitCallback')(aksjonspunktValues);

    expect(stub).to.have.property('callCount', 1);
    const { args } = stub.getCalls()[0];
    expect(args).to.have.length(2);
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

    const wrapper = shallow(<BehandlingsprosessInnsynIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={123}
      aksjonspunkter={toAksjonspunkter}
      behandlingspunkter={[]}
      selectedBehandlingspunkt={null}
      resetBehandlingspunkter={sinon.spy()}
      location={{ pathname: 'test' }}
      push={sinon.spy()}
      resolveProsessAksjonspunkter={stub}
      fetchPreview={sinon.spy()}
      fetchVedtaksbrevPreview={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      haveSentVarsel
      behandlingType={{
        kode: BehandlingType.FORSTEGANGSSOKNAD,
        navn: 'FORSTEGANGSSOKNAD',
      }}
      isSelectedBehandlingHenlagt={false}
      fagsakYtelseType={{
        kode: fagsakYtelseType.FORELDREPENGER,
        navn: 'FORELDREPENGER',
      }}
      behandlingStatus={{
        kode: behandlingStatus.OPPRETTET,
        navn: 'OPPRETTET',
      }}
      resolveProsessAksjonspunkterSuccess
      resolveFaktaAksjonspunkterSuccess
      behandlingsresultat={{
        kode: 'test',
        navn: 'test',
      }}
    />);

    const panel = wrapper.find(BehandlingspunktInnsynInfoPanel);
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
    expect(args).to.have.length(2);
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
