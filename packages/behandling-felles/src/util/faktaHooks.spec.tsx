import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
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

import faktaHooks from './faktaHooks';
import { DEFAULT_FAKTA_KODE } from './faktaUtils';

const HookWrapper = ({ callback }) => <div {...callback()} />;

const testHook = (callback) => shallow(<HookWrapper callback={callback} />);


describe('<faktaHooks>', () => {
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

  it('skal utlede faktapaneler og valgt panel', () => {
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
    const valgtFaktaSteg = 'default';
    const intl = { formatMessage: (data) => data.id };

    const wrapper = testHook(() => faktaHooks.useFaktaPaneler(faktaPanelDefinisjoner, ekstraPanelData, behandling, rettigheter,
      aksjonspunkter, hasFetchError, valgtFaktaSteg, intl));
    const [faktaPaneler, valgtPanel, formaterteFaktaPaneler] = Object.values(wrapper.find('div').props()).reduce((acc, value) => [...acc, value], []);

    const paneler = [{
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
    }];

    expect(faktaPaneler).to.eql(paneler);
    expect(valgtPanel).to.eql(paneler[0]);
    expect(formaterteFaktaPaneler).to.eql([{
      erAktiv: true,
      harAksjonspunkt: true,
      tekst: 'ArbeidsforholdInfoPanel.Title',
    }]);
  });

  it('skal bruke callbacks for å velge faktapanel og for å lagre', () => {
    const aksjonspunkter = [{
      definisjon: { kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    }];
    const paneler = [{
      urlCode: 'arbeidsforhold',
      textCode: 'ArbeidsforholdInfoPanel.Title',
      endpoints: [],
      renderComponent: () => undefined,
      harApneAksjonspunkter: true,
      komponentData: {
        aksjonspunkter: [aksjonspunkter[0]],
        readOnly: false,
        submittable: true,
        harApneAksjonspunkter: true,
        alleMerknaderFraBeslutter: {
          [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: { notAccepted: undefined },
        },
        personopplysninger: {},
        inntektArbeidYtelse: {},
      },
    }];

    const dispatch = () => Promise.resolve();
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const makeRestApiRequest = sinon.spy();
    const overstyringApCodes = [];
    const valgtProsessSteg = 'default';
    const behandlingApi: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };

    const wrapper = testHook(() => faktaHooks.useCallbacks(paneler, fagsak, behandling, oppdaterProsessStegOgFaktaPanelIUrl,
      valgtProsessSteg, overstyringApCodes, behandlingApi as {[name: string]: EndpointOperations}, dispatch as Dispatch));
    const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = Object.values(wrapper.find('div').props()).reduce((acc, value) => [...acc, value], []);

    velgFaktaPanelCallback(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql(DEFAULT_FAKTA_KODE);
    expect(opppdaterKall[0].args[1]).to.eql('arbeidsforhold');

    const aksjonspunkterSomSkalLagres = [{
      kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
    }];
    bekreftAksjonspunktCallback(aksjonspunkterSomSkalLagres);

    const requestKall = makeRestApiRequest.getCalls();
    expect(requestKall).to.have.length(1);
    expect(requestKall[0].args).to.have.length(1);
    expect(requestKall[0].args[0]).to.eql({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunkter[0].definisjon.kode,
        kode: aksjonspunkter[0].definisjon.kode,
      }],
    });
  });
});
