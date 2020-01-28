import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import DataFetcherBehandlingDataV2 from '../DataFetcherBehandlingDataV2';
import InngangsvilkarPanel from './InngangsvilkarPanel';
import BehandlingHenlagtPanel from './BehandlingHenlagtPanel';
import ProsessStegPanel from './ProsessStegPanel';
import MargMarkering from './MargMarkering';
import ProsessStegIkkeBehandletPanel from './ProsessStegIkkeBehandletPanel';

describe('<ProsessStegPanel>', () => {
  const fagsak = {
    saksnummer: 123456,
    fagsakYtelseType: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    fagsakStatus: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
    fagsakPerson: {
      alder: 30,
      personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
      erDod: false,
      erKvinne: true,
      navn: 'Espen Utvikler',
      personnummer: '12345',
    },
  };
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

  const aksjonspunkter = [{
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
      kodeverk: 'AKSJONSPUNKT_STATUS',
    },
    definisjon: {
      kode: aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN,
      kodeverk: 'AKSJONSPUNKT_KODE',
    },
    kanLoses: true,
    erAktivt: true,
  }];

  const fellesProsessStegData = {
    label: 'test',
    isAksjonspunktOpen: true,
    isReadOnly: false,
    aksjonspunkter: [],
    status: vilkarUtfallType.IKKE_OPPFYLT,
    panelData: [{
      aksjonspunkter: [],
      isReadOnly: false,
      status: vilkarUtfallType.IKKE_OPPFYLT,
      komponentData: {
        isReadOnly: false,
        readOnlySubmitButton: false,
        aksjonspunkter: [],
        vilkar: [],
        isAksjonspunktOpen: false,
        overrideReadOnly: false,
        kanOverstyreAccess: false,
        toggleOverstyring: () => {},
      },
    }],
  };

  it('skal vise panel for henlagt behandling når valgt panel er vedtakspanelet og behandling er henlagt', () => {
    const valgtPanel = {
      ...fellesProsessStegData,
      urlCode: bpc.VEDTAK,
      erStegBehandlet: false,
      isReadOnly: false,
      panelData: [],
      aksjonspunkter,
    };

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={valgtPanel}
        fagsak={fagsak}
        behandling={{
          ...behandling,
          behandlingHenlagt: true,
        }}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        behandlingApi={{}}
        dispatch={sinon.spy()}
      />,
    );

    expect(wrapper.find(BehandlingHenlagtPanel)).to.have.length(1);
    expect(wrapper.find(MargMarkering)).to.have.length(0);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).to.have.length(0);
  });

  it('skal vise panel for steg ikke behandlet når steget ikke er behandlet og saken ikke er henlagt', () => {
    const valgtPanel = {
      ...fellesProsessStegData,
      urlCode: bpc.VEDTAK,
      erStegBehandlet: false,
      isReadOnly: false,
      panelData: [],
      aksjonspunkter,
    };

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={valgtPanel}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        behandlingApi={{}}
        dispatch={sinon.spy()}
      />,
    );

    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).to.have.length(1);
    expect(wrapper.find(BehandlingHenlagtPanel)).to.have.length(0);
    expect(wrapper.find(MargMarkering)).to.have.length(0);
  });

  it('skal vise panel for inngangsvilkår når det er data for flere panel', () => {
    const valgtPanel = {
      ...fellesProsessStegData,
      urlCode: bpc.INNGANGSVILKAR,
      erStegBehandlet: true,
      isReadOnly: false,
      panelData: [{
        ...fellesProsessStegData.panelData[0],
        code: 'FODSEL',
        renderComponent: () => undefined,
        endpoints: [],
        isAksjonspunktOpen: true,
        aksjonspunktHelpTextCodes: [],
      }, {
        ...fellesProsessStegData.panelData[0],
        code: 'MEDLEMSKAP',
        renderComponent: () => undefined,
        endpoints: [],
        isAksjonspunktOpen: true,
        aksjonspunktHelpTextCodes: [],
      }],
      aksjonspunkter,
    };

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={valgtPanel}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        behandlingApi={{}}
        dispatch={sinon.spy()}
      />,
    );

    expect(wrapper.find(MargMarkering)).to.have.length(1);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).to.have.length(0);
    expect(wrapper.find(BehandlingHenlagtPanel)).to.have.length(0);

    expect(wrapper.find(InngangsvilkarPanel)).to.have.length(1);
    expect(wrapper.find(DataFetcherBehandlingDataV2)).to.have.length(0);
  });

  it('skal vise kun vise ett panel', () => {
    const valgtPanel = {
      ...fellesProsessStegData,
      urlCode: bpc.INNGANGSVILKAR,
      erStegBehandlet: true,
      isReadOnly: false,
      panelData: [{
        ...fellesProsessStegData.panelData[0],
        code: 'FODSEL',
        renderComponent: () => undefined,
        endpoints: [],
        isAksjonspunktOpen: true,
        aksjonspunktHelpTextCodes: [],
      }],
      aksjonspunkter,
    };

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={valgtPanel}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={sinon.spy()}
        behandlingApi={{}}
        dispatch={sinon.spy()}
      />,
    );

    expect(wrapper.find(MargMarkering)).to.have.length(1);
    expect(wrapper.find(ProsessStegIkkeBehandletPanel)).to.have.length(0);
    expect(wrapper.find(BehandlingHenlagtPanel)).to.have.length(0);

    expect(wrapper.find(DataFetcherBehandlingDataV2)).to.have.length(1);
    expect(wrapper.find(InngangsvilkarPanel)).to.have.length(0);
  });

  it('skal lagre aksjonspunkt', () => {
    const valgtPanel = {
      ...fellesProsessStegData,
      urlCode: bpc.INNGANGSVILKAR,
      erStegBehandlet: true,
      isReadOnly: false,
      panelData: [{
        ...fellesProsessStegData.panelData[0],
        code: 'FODSEL',
        renderComponent: () => undefined,
        endpoints: [],
        isAksjonspunktOpen: true,
        aksjonspunktHelpTextCodes: [],
      }, {
        ...fellesProsessStegData.panelData[0],
        code: 'MEDLEMSKAP',
        renderComponent: () => undefined,
        endpoints: [],
        isAksjonspunktOpen: true,
        aksjonspunktHelpTextCodes: [],
      }],
      aksjonspunkter,
    };

    const lagringSideeffekterCallback = sinon.spy();
    const makeRestApiRequest = sinon.spy();
    const behandlingApi = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };
    const dispatch = () => Promise.resolve();

    const wrapper = shallow(
      <ProsessStegPanel
        valgtProsessSteg={valgtPanel}
        fagsak={fagsak}
        behandling={behandling}
        alleKodeverk={{}}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        lagringSideeffekterCallback={lagringSideeffekterCallback}
        behandlingApi={behandlingApi}
        dispatch={dispatch}
      />,
    );

    const panel = wrapper.find(InngangsvilkarPanel);

    const aksjonspunktModels = [{
      kode: aksjonspunkter[0].definisjon.kode,
    }];
    panel.prop('submitCallback')(aksjonspunktModels);

    expect(lagringSideeffekterCallback.getCalls()).to.have.length(1);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunktModels[0].kode,
        kode: aksjonspunktModels[0].kode,
      }],
    });
  });
});
