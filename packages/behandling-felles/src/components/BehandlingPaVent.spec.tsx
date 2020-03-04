import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingErPaVentModal } from '@fpsak-frontend/fp-felles';

import BehandlingPaVent from './BehandlingPaVent';

describe('<BehandlingPaVent>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      kodeverk: 'BEHANDLING_STATUS',
    },
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    links: [],
  };
  const aksjonspunkter = [];
  const kodeverk = {};

  const navAnsatt = {
    brukernavn: 'Espen Utvikler',
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
    kanBeslutte: false,
    kanOverstyre: false,
    kanSaksbehandle: true,
    kanVeilede: false,
    navn: 'Espen Utvikler',
  };

  it('skal ikke vise modal når behandling ikke er på vent', () => {
    const wrapper = shallow(<BehandlingPaVent
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      navAnsatt={navAnsatt}
    />);

    expect(wrapper.find(BehandlingErPaVentModal)).to.have.length(0);
  });

  it('skal vise modal når behandling er på vent', () => {
    const wrapper = shallow(<BehandlingPaVent
      behandling={{
        ...behandling,
        behandlingPaaVent: true,
      }}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      navAnsatt={navAnsatt}
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('showModal')).is.true;
    expect(modal.prop('hasManualPaVent')).to.false;
  });

  it('skal vise modal og så skjule den ved trykk på knapp', () => {
    const wrapper = shallow(<BehandlingPaVent
      behandling={{
        ...behandling,
        behandlingPaaVent: true,
      }}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      navAnsatt={navAnsatt}
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);
    expect(modal).to.have.length(1);

    modal.prop('closeEvent')();

    expect(wrapper.find(BehandlingErPaVentModal)).to.have.length(0);
  });

  it('skal markeres som automatisk satt på vent når en har åpent aksjonspunkt for auto-manuelt satt på vent', () => {
    const wrapper = shallow(<BehandlingPaVent
      behandling={{
        ...behandling,
        behandlingPaaVent: true,
      }}
      aksjonspunkter={[{
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'AKSJONSPUNKT_STATUS',
        },
        definisjon: {
          kode: aksjonspunktCodes.AUTO_MANUELT_SATT_PÅ_VENT,
          kodeverk: 'AKSJONSPUNKT_KODE',
        },
        kanLoses: true,
        erAktivt: true,
      }]}
      kodeverk={kodeverk}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      navAnsatt={navAnsatt}
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('hasManualPaVent')).to.true;
  });

  it('skal oppdatere på-vent-informasjon og så hente behandling på nytt', async () => {
    const settPaVentCallback = sinon.stub();
    settPaVentCallback.returns(Promise.resolve());
    const hentBehandlingCallback = sinon.spy();

    const wrapper = shallow(<BehandlingPaVent
      behandling={{
        ...behandling,
        behandlingPaaVent: true,
      }}
      aksjonspunkter={aksjonspunkter}
      kodeverk={kodeverk}
      settPaVent={settPaVentCallback}
      hentBehandling={hentBehandlingCallback}
      navAnsatt={navAnsatt}
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);

    await modal.prop('handleOnHoldSubmit')({ dato: '10.10.2019' });

    const calls = settPaVentCallback.getCalls();
    expect(calls).to.have.length(1);
    expect(calls[0].args).to.have.length(1);
    expect(calls[0].args[0]).to.eql({
      behandlingId: 1,
      behandlingVersjon: 1,
      dato: '10.10.2019',
    });

    const calls2 = hentBehandlingCallback.getCalls();
    expect(calls2).to.have.length(1);
    expect(calls2[0].args).to.have.length(2);
    expect(calls2[0].args[0]).to.eql({
      behandlingId: 1,
    });
    expect(calls2[0].args[1]).to.eql({
      keepData: false,
    });
  });
});
