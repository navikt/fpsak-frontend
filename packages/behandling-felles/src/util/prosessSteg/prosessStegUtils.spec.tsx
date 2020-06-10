import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { Behandling } from '@fpsak-frontend/types';

import { ProsessStegUtledet, ProsessStegPanelUtledet } from './ProsessStegUtledet';
import {
  utledProsessStegPaneler, getBekreftAksjonspunktCallback, formaterPanelerForProsessmeny, finnValgtPanel,
} from './prosessStegUtils';
import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';

describe('<prosessStegUtils>', () => {
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
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter = [{
    definisjon: { kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU, kodeverk: 'BEHANDLING_DEF' },
    status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
    kanLoses: true,
    erAktivt: true,
    aksjonspunktType: { kode: aksjonspunktType.MANUELL, kodeverk: 'test' },
  }];

  const vilkar = [{
    vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
    vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
    overstyrbar: false,
  }];

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };
  const isReadOnlyCheck = () => false;
  const toggleOverstyring = () => undefined;

  class TestPanelDef extends ProsessStegPanelDef {
    getKomponent = (props) => <div {...props} />

    getAksjonspunktKoder = () => [
      aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    ]
  }

  const testPanelDef = new TestPanelDef();

  class TestProsessStegPanelDef extends ProsessStegDef {
    getUrlKode = () => 'test'

    getTekstKode = () => 'Behandlingspunkt.Test'

    getPanelDefinisjoner = () => [testPanelDef]
  }

  const testStegDef = new TestProsessStegPanelDef();
  const utledetTestDelPanel = new ProsessStegPanelUtledet(testStegDef, testPanelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
    toggleOverstyring, kanOverstyreAccess, []);
  const utledetTestPanel = new ProsessStegUtledet(testStegDef, [utledetTestDelPanel]);

  class PanelDef extends ProsessStegPanelDef {
    getKomponent = (props) => <div {...props} />

    getAksjonspunktKoder = () => [
      aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
    ]

    getAksjonspunktTekstkoder = () => [
      'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
    ]

    getVilkarKoder = () => [
      vilkarType.SOKERSOPPLYSNINGSPLIKT,
    ]

    getData = ({ soknad }) => ({
      soknad,
    })
  }

  const panelDef = new PanelDef();

  class OpplysningspliktProsessStegPanelDef extends ProsessStegDef {
    getUrlKode = () => prosessStegCodes.OPPLYSNINGSPLIKT

    getTekstKode = () => 'Behandlingspunkt.Opplysningsplikt'

    getPanelDefinisjoner = () => [panelDef]
  }

  it('skal utlede prosess-steg-paneler', () => {
    const ekstraPanelData = {
      soknad: 'test_soknad',
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

    const hasFetchError = false;
    const overstyrteAksjonspunktKoder = [];

    // ACT
    const prosessStegPaneler = utledProsessStegPaneler([new OpplysningspliktProsessStegPanelDef()], ekstraPanelData,
      toggleOverstyring, overstyrteAksjonspunktKoder, behandling as Behandling, aksjonspunkter, vilkar, rettigheter, hasFetchError);

    expect(prosessStegPaneler).to.have.length(1);
    const panel = prosessStegPaneler[0];
    expect(panel.getUrlKode()).to.eql('opplysningsplikt');
    expect(panel.getTekstKode()).to.eql('Behandlingspunkt.Opplysningsplikt');
    expect(panel.getErReadOnly()).is.true;
    expect(panel.getErAksjonspunktOpen()).is.true;
    expect(panel.getAksjonspunkter()).to.eql(aksjonspunkter);
    expect(panel.getErStegBehandlet()).is.true;
    expect(panel.getStatus()).to.eql(vilkarUtfallType.IKKE_VURDERT);

    expect(panel.getDelPaneler()).to.have.length(1);
    const delPanel = panel.getDelPaneler()[0];
    expect(delPanel.getAksjonspunktHjelpetekster()).to.eql(['SokersOpplysningspliktForm.UtfyllendeOpplysninger']);
    expect(delPanel.getAksjonspunkterForPanel()).to.eql(aksjonspunkter);
    expect(delPanel.getErAksjonspunktOpen()).is.true;
    expect(delPanel.getErReadOnly()).is.true;
    expect(delPanel.getStatus()).to.eql(vilkarUtfallType.IKKE_VURDERT);
    expect(delPanel.getProsessStegDelPanelDef().getEndepunkter()).to.eql([]);
    expect(delPanel.getProsessStegDelPanelDef().getKomponent).to.eql(panelDef.getKomponent);

    expect(delPanel.getKomponentData()).to.eql({
      aksjonspunkter,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      readOnlySubmitButton: false,
      soknad: ekstraPanelData.soknad,
      status: vilkarUtfallType.IKKE_VURDERT,
      vilkar,
    });
  });

  it('skal vise valgt panel', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel([utledetTestPanel, utledetPanel], erBehandlingHenlagt, 'opplysningsplikt', apentFaktaPanelInfo);

    expect(valgtPanel).to.eql(utledetPanel);
  });

  it('skal vise ikke vise prosess-steg panel når ingen er spesifikt valgt og en har åpent fakta-aksjonspunkt', () => {
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = { urlCode: 'FODSEL', textCode: 'Fakta.Test' };

    const valgtPanel = finnValgtPanel([utledetTestPanel], erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).is.undefined;
  });

  it('skal vise panel som har åpent aksjonspunkt', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel([utledetTestPanel, utledetPanel], erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).is.eql(utledetPanel);
  });

  it('skal formatere paneler for prosessmeny', () => {
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const formatertePaneler = formaterPanelerForProsessmeny([utledetTestPanel, utledetPanel], 'opplysningsplikt');
    expect(formatertePaneler).to.eql([{
      isActive: false,
      isDisabled: false,
      isFinished: false,
      labelId: 'Behandlingspunkt.Test',
      type: 'default',
    }, {
      isActive: true,
      isDisabled: false,
      isFinished: false,
      labelId: 'Behandlingspunkt.Opplysningsplikt',
      type: 'warning',
    }]);
  });

  it('skal lagre aksjonspunkt', () => {
    const dispatch = () => Promise.resolve();
    const makeRestApiRequest = sinon.spy();
    const api: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
      SAVE_OVERSTYRT_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };
    const lagringSideEffectsCallback = sinon.spy();

    const callback = getBekreftAksjonspunktCallback(
      dispatch as Dispatch, lagringSideEffectsCallback, fagsak, behandling as Behandling, aksjonspunkter,
      api as {[name: string]: EndpointOperations},
    );
    const aksjonspunktModeller = [{
      kode: aksjonspunkter[0].definisjon.kode,
    }];

    callback(aksjonspunktModeller);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunktModeller[0].kode,
        kode: aksjonspunktModeller[0].kode,
      }],
    });
  });

  it('skal lagre overstyrt aksjonspunkt', () => {
    const dispatch = () => Promise.resolve();
    const makeRestApiRequest = sinon.spy();
    const api: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
      SAVE_OVERSTYRT_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };
    const lagringSideEffectsCallback = sinon.spy();

    const callback = getBekreftAksjonspunktCallback(dispatch as Dispatch, lagringSideEffectsCallback, fagsak, behandling as Behandling, aksjonspunkter,
      api as {[name: string]: EndpointOperations});

    const aksjonspunktModeller = [{
      kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
    }];

    callback(aksjonspunktModeller);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [{
        '@type': aksjonspunktModeller[0].kode,
        kode: aksjonspunktModeller[0].kode,
      }],
    });
  });
});
