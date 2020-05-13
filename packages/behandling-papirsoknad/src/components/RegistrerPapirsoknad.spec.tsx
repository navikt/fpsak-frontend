import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { BehandlingPaVent } from '@fpsak-frontend/behandling-felles';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';
import { Behandling } from '@fpsak-frontend/types';

import RegistrerPapirsoknad from './RegistrerPapirsoknad';
import SoknadRegistrertModal from './SoknadRegistrertModal';
import RegistrerPapirsoknadPanel from './RegistrerPapirsoknadPanel';

const fagsak = {
  saksnummer: 123456,
  fagsakYtelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: 'YTELSE_TYPE',
  },
  fagsakPerson: {
    alder: 30,
    erDod: false,
    erKvinne: true,
    navn: 'Petra',
    personnummer: '12343541',
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  fagsakStatus: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: 'FAGSAK_STATUS',
  },
};

const behandling = {
  id: 1,
  versjon: 2,
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

const rettigheter = {
  writeAccess: {
    isEnabled: true,
    employeeHasAccess: true,
  },
  kanOverstyreAccess: {
    isEnabled: true,
    employeeHasAccess: true,
  },
};

describe('<RegistrerPapirsoknad>', () => {
  it('skal rendre komponenter', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      fagsak={fagsak}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      kodeverk={{}}
      rettigheter={rettigheter}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      lagreAksjonspunkt={sinon.spy()}
      erAksjonspunktLagret={false}
    />);
    expect(wrapper.find(BehandlingPaVent)).to.have.length(1);
    expect(wrapper.find(SoknadRegistrertModal)).to.have.length(1);
    const panel = wrapper.find(RegistrerPapirsoknadPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('readOnly')).to.be.false;
  });

  it('skal rendre komponenter som readonly når veileder', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      fagsak={fagsak}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      kodeverk={{}}
      rettigheter={{
        ...rettigheter,
        writeAccess: {
          isEnabled: false,
          employeeHasAccess: false,
        },
      }}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      lagreAksjonspunkt={sinon.spy()}
      erAksjonspunktLagret={false}
    />);
    const panel = wrapper.find(RegistrerPapirsoknadPanel);
    expect(panel.prop('readOnly')).to.be.true;
  });

  it('skal rendre komponenter som readonly når behandling er satt på vent', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      fagsak={fagsak}
      behandling={{
        ...behandling,
        behandlingPaaVent: true,
      } as Behandling}
      aksjonspunkter={[]}
      kodeverk={{}}
      rettigheter={rettigheter}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      lagreAksjonspunkt={sinon.spy()}
      erAksjonspunktLagret={false}
    />);
    expect(wrapper.find(BehandlingPaVent)).to.have.length(1);
    expect(wrapper.find(SoknadRegistrertModal)).to.have.length(1);
    const panel = wrapper.find(RegistrerPapirsoknadPanel);
    expect(panel).to.have.length(1);
    expect(panel.prop('readOnly')).to.be.true;
  });

  it('skal sette nye søknadsdata', () => {
    const wrapper = shallow(<RegistrerPapirsoknad
      fagsak={fagsak}
      behandling={behandling as Behandling}
      aksjonspunkter={[]}
      kodeverk={{}}
      rettigheter={rettigheter}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      lagreAksjonspunkt={sinon.spy()}
      erAksjonspunktLagret={false}
    />);

    const panel = wrapper.find(RegistrerPapirsoknadPanel);
    expect(panel.prop('soknadData')).is.undefined;

    const nyeSoknadsdata = new SoknadData(fagsakYtelseType.FORELDREPENGER, familieHendelseType.FODSEL, foreldreType.MOR);
    panel.prop('setSoknadData')(nyeSoknadsdata);

    const panelV2 = wrapper.find(RegistrerPapirsoknadPanel);
    expect(panelV2.prop('soknadData')).is.eql(nyeSoknadsdata);
  });

  it('skal lagre aksjonspunkt', () => {
    const lagreAksjonspunkt = sinon.spy();
    const wrapper = shallow(<RegistrerPapirsoknad
      fagsak={fagsak}
      behandling={behandling as Behandling}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER,
          kodeverk: 'DEF',
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
          kodeverk: 'STATUS',
        },
        kanLoses: true,
        erAktivt: true,
      }]}
      kodeverk={{}}
      rettigheter={rettigheter}
      settPaVent={sinon.spy()}
      hentBehandling={sinon.spy()}
      lagreAksjonspunkt={lagreAksjonspunkt}
      erAksjonspunktLagret={false}
    />);

    const panel = wrapper.find(RegistrerPapirsoknadPanel);

    const nyeSoknadsdata = new SoknadData(fagsakYtelseType.FORELDREPENGER, familieHendelseType.FODSEL, foreldreType.MOR);
    panel.prop('setSoknadData')(nyeSoknadsdata);

    const panelV2 = wrapper.find(RegistrerPapirsoknadPanel);
    panelV2.prop('lagreFullstendig')(undefined, undefined, { valuesForRegisteredFieldsOnly: { data: 'test' } });

    const calls = lagreAksjonspunkt.getCalls();
    expect(calls).to.have.length(1);
    const { args } = calls[0];
    expect(args).to.have.length(1);
    expect(args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_FORELDREPENGER,
        soker: foreldreType.MOR,
        soknadstype: fagsakYtelseType.FORELDREPENGER,
        tema: familieHendelseType.FODSEL,
        data: 'test',
      }],
    });
  });
});
