import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Dispatch } from 'redux';

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

import {
  utledFaktaPaneler, finnValgtPanel, formaterPanelerForSidemeny, getBekreftAksjonspunktCallback, DEFAULT_FAKTA_KODE, DEFAULT_PROSESS_STEG_KODE,
} from './faktaUtils';

describe('<faktaPanelUtils>', () => {
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

  it('skal utlede faktapanel', () => {
    const faktaPanelDefinisjoner = [{
      urlCode: faktaPanelCodes.ARBEIDSFORHOLD,
      textCode: 'ArbeidsforholdInfoPanel.Title',
      aksjonspunkterCodes: [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD],
      endpoints: [],
      renderComponent: (props) => <ArbeidsforholdFaktaIndex {...props} />,
      showComponent: ({ personopplysninger }) => personopplysninger,
      getData: ({ personopplysninger, inntektArbeidYtelse }) => ({ personopplysninger, inntektArbeidYtelse }),
    }];
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
    const hasFetchError = false;

    const faktaPaneler = utledFaktaPaneler(faktaPanelDefinisjoner, ekstraPanelData, behandling, rettigheter, aksjonspunkter, hasFetchError);

    expect(faktaPaneler).to.have.length(1);
    expect(faktaPaneler[0]).to.eql({
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      endpoints: [],
      renderComponent: faktaPanelDefinisjoner[0].renderComponent,
      harApneAksjonspunkter: true,
      komponentData: {
        aksjonspunkter: [aksjonspunkter[0]],
        readOnly: false,
        submittable: true,
        harApneAksjonspunkter: true,
        alleMerknaderFraBeslutter: {
          [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
        },
        personopplysninger: ekstraPanelData.personopplysninger,
        inntektArbeidYtelse: ekstraPanelData.inntektArbeidYtelse,
      },
    });
  });

  const komponentData = {
    aksjonspunkter: [],
    readOnly: false,
    submittable: true,
    harApneAksjonspunkter: true,
    alleMerknaderFraBeslutter: {
      [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
    },
    personopplysninger: {},
    inntektArbeidYtelse: {},
  };

  it('skal finne ut at valgt faktapanel er panelet med åpent aksjonspunkt', () => {
    const paneler = [{
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      endpoints: [],
      renderComponent: () => undefined,
      harApneAksjonspunkter: false,
      komponentData,
    }, {
      urlCode: 'test',
      textCode: 'Test.Title',
      endpoints: [],
      renderComponent: () => undefined,
      harApneAksjonspunkter: true,
      komponentData,
    }];
    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.urlCode).to.eql(paneler[1].urlCode);
  });

  it('skal finne ut at valgt faktapanel er første panel når det ikke finnes åpne aksjonspunkter', () => {
    const paneler = [{
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      endpoints: [],
      harApneAksjonspunkter: false,
      renderComponent: () => undefined,
      komponentData,
    }, {
      urlCode: 'test',
      textCode: 'Test.Title',
      endpoints: [],
      harApneAksjonspunkter: false,
      renderComponent: () => undefined,
      komponentData,
    }];
    const valgtFaktaPanelKode = DEFAULT_FAKTA_KODE;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.urlCode).to.eql(paneler[0].urlCode);
  });

  it('skal finne faktapanel som er satt i URL', () => {
    const paneler = [{
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      endpoints: [],
      harApneAksjonspunkter: false,
      renderComponent: () => undefined,
      komponentData,
    }, {
      urlCode: 'test',
      textCode: 'Test.Title',
      endpoints: [],
      harApneAksjonspunkter: false,
      renderComponent: () => undefined,
      komponentData,
    }];
    const valgtFaktaPanelKode = paneler[1].urlCode;

    const valgtPanel = finnValgtPanel(paneler, valgtFaktaPanelKode);

    expect(valgtPanel.urlCode).to.eql(paneler[1].urlCode);
  });

  it('skal formatere paneler for sidemeny', () => {
    const paneler = [{
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      harApneAksjonspunkter: false,
      endpoints: [],
      renderComponent: () => undefined,
      komponentData,
    }, {
      urlCode: 'test',
      textCode: 'Test.Title',
      harApneAksjonspunkter: true,
      endpoints: [],
      renderComponent: () => undefined,
      komponentData,
    }];
    const intl = {
      formatMessage: (o) => o.id,
    };
    const valgtFaktaPanelKode = paneler[1].urlCode;

    const formatertePaneler = formaterPanelerForSidemeny(intl, paneler, valgtFaktaPanelKode);

    expect(formatertePaneler).to.eql([{
      tekst: paneler[0].textCode,
      erAktiv: false,
      harAksjonspunkt: false,
    }, {
      tekst: paneler[1].textCode,
      erAktiv: true,
      harAksjonspunkt: true,
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

    const callback = getBekreftAksjonspunktCallback(dispatch as Dispatch, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, overstyringApCodes,
      api as {[name: string]: EndpointOperations});

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

    const callback = getBekreftAksjonspunktCallback(dispatch as Dispatch, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl, overstyringApCodes,
      api as {[name: string]: EndpointOperations});

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
