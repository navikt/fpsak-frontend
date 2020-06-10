import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Dispatch } from 'redux';

import { Behandling } from '@fpsak-frontend/types';
import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { faktaPanelCodes } from '@fpsak-frontend/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import FaktaPanelDef from './FaktaPanelDef';
import FaktaPanelUtledet from './FaktaPanelUtledet';
import {
  utledFaktaPaneler, finnValgtPanel, formaterPanelerForSidemeny, getBekreftAksjonspunktCallback, DEFAULT_FAKTA_KODE, DEFAULT_PROSESS_STEG_KODE,
} from './faktaUtils';

describe('<faktaUtils>', () => {
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

  class ArbeidsforholdFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => faktaPanelCodes.ARBEIDSFORHOLD

    getTekstKode = () => 'ArbeidsforholdInfoPanel.Title'

    getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]

    getKomponent = (props) => <ArbeidsforholdFaktaIndex {...props} />

    getOverstyrVisningAvKomponent = ({ personopplysninger }) => personopplysninger

    getData = ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse })
  }
  class TestFaktaPanelDef extends FaktaPanelDef {
    getUrlKode = () => 'test'

    getTekstKode = () => 'Test.Title'

    getKomponent = () => <div>test</div>
  }

  it('skal utlede faktapanel', () => {
    const ekstraPanelData = {
      personopplysninger: 'test_personopplysninger',
      inntektArbeidYtelse: 'test_inntektArbeidYtelse',
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
    const aksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
    }];

    const panelDef = new ArbeidsforholdFaktaPanelDef();

    const faktaPaneler = utledFaktaPaneler([panelDef], ekstraPanelData, behandling as Behandling, rettigheter, aksjonspunkter);

    expect(faktaPaneler).to.have.length(1);
    expect(faktaPaneler[0].getPanelDef()).to.eql(panelDef);
    expect(faktaPaneler[0].getHarApneAksjonspunkter()).is.true;
    expect(faktaPaneler[0].getKomponentData(rettigheter, ekstraPanelData, false)).to.eql({
      aksjonspunkter: [aksjonspunkter[0]],
      readOnly: false,
      submittable: true,
      harApneAksjonspunkter: true,
      alleMerknaderFraBeslutter: {
        [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
      },
      personopplysninger: ekstraPanelData.personopplysninger,
      inntektArbeidYtelse: ekstraPanelData.inntektArbeidYtelse,
    });
  });

  it('skal finne ut at valgt faktapanel er panelet med åpent aksjonspunkt', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();

    const aksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
    }];

    const paneler = [
      new FaktaPanelUtledet(panelDef2, behandling, []),
      new FaktaPanelUtledet(panelDef, behandling, aksjonspunkter),
    ];
    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).to.eql(paneler[1].getUrlKode());
  });

  it('skal finne ut at valgt faktapanel er første panel når det ikke finnes åpne aksjonspunkter', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const paneler = [
      new FaktaPanelUtledet(panelDef, behandling, []),
      new FaktaPanelUtledet(panelDef2, behandling, []),
    ];

    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).to.eql(paneler[0].getUrlKode());
  });

  it('skal finne faktapanel som er satt i URL', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const paneler = [
      new FaktaPanelUtledet(panelDef, behandling, []),
      new FaktaPanelUtledet(panelDef2, behandling, []),
    ];

    const valgtFaktaPanelKode = paneler[1].getUrlKode();

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.getUrlKode()).to.eql(paneler[1].getUrlKode());
  });

  it('skal formatere paneler for sidemeny', () => {
    const panelDef = new ArbeidsforholdFaktaPanelDef();
    const panelDef2 = new TestFaktaPanelDef();
    const aksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
    }];
    const paneler = [
      new FaktaPanelUtledet(panelDef, behandling, aksjonspunkter),
      new FaktaPanelUtledet(panelDef2, behandling, []),
    ];
    const intl = {
      formatMessage: (o) => o.id,
    };
    const valgtFaktaPanelKode = paneler[0].getUrlKode();

    const formatertePaneler = formaterPanelerForSidemeny(intl, paneler, valgtFaktaPanelKode);

    expect(formatertePaneler).to.eql([{
      tekst: paneler[0].getTekstKode(),
      erAktiv: true,
      harAksjonspunkt: true,
    }, {
      tekst: paneler[1].getTekstKode(),
      erAktiv: false,
      harAksjonspunkt: false,
    }]);
  });

  it('skal lagre aksjonspunkt', async () => {
    const dispatch = () => Promise.resolve();
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const makeRestApiRequest = sinon.spy();
    const overstyringApCodes = [];
    const api: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };

    const callback = getBekreftAksjonspunktCallback(dispatch as Dispatch, fagsak, behandling as Behandling, oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes, api as {[name: string]: EndpointOperations});

    const aksjonspunkter = [{
      kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
    }];

    await callback(aksjonspunkter);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunkter[0].kode,
        kode: aksjonspunkter[0].kode,
      }],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[0]).to.eql(DEFAULT_PROSESS_STEG_KODE);
  });

  it('skal lagre overstyrt aksjonspunkt', async () => {
    const dispatch = () => Promise.resolve();
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const makeRestApiRequest = sinon.spy();
    const overstyringApCodes = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];
    const api: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_OVERSTYRT_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };

    const callback = getBekreftAksjonspunktCallback(dispatch as Dispatch, fagsak, behandling as Behandling, oppdaterProsessStegOgFaktaPanelIUrl,
      overstyringApCodes, api as {[name: string]: EndpointOperations});

    const aksjonspunkter = [{
      kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
    }];

    await callback(aksjonspunkter);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [{
        '@type': aksjonspunkter[0].kode,
        kode: aksjonspunkter[0].kode,
      }],
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[0]).to.eql(DEFAULT_PROSESS_STEG_KODE);
  });
});
