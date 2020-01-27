import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { StepType } from '@navikt/nap-process-menu/dist/Step';

import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import prosessStegHooks from './prosessStegHooks';

const HookWrapper = ({ callback }) => <div values={callback()} />;

const testHook = (callback) => shallow(<HookWrapper callback={callback} />);

describe('<prosessStegHooks>', () => {
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
  }];

  const vilkar = [{
    vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
    vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
    overstyrbar: false,
  }];

  it('skal utlede prosesstegpaneler, valgt panel og paneler formatert for meny', () => {
    const prosessStegPanelDefinisjoner = [{
      urlCode: bpc.OPPLYSNINGSPLIKT,
      textCode: 'Behandlingspunkt.Opplysningsplikt',
      panels: [{
        aksjonspunkterCodes: [aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU],
        aksjonspunkterTextCodes: ['SokersOpplysningspliktForm.UtfyllendeOpplysninger', 'SokersOpplysningspliktForm.UtfyllendeOpplysninger'],
        vilkarCodes: [vilkarType.SOKERSOPPLYSNINGSPLIKT],
        endpoints: [],
        getData: ({ soknad }) => ({ soknad }),
        showComponent: undefined,
        renderComponent: (props) => <div {...props} />,
        overrideStatus: undefined,
        isOverridable: false,
        overridePanel: undefined,
      }],
    }];

    const ekstraPanelData = {
      soknad: 'test_soknad',
    };
    const navAnsatt = {
      brukernavn: 'Espen Utvikler',
      navn: 'Espen Utvikler',
      kanVeilede: false,
      kanSaksbehandle: true,
      kanOverstyre: false,
      kanBeslutte: false,
      kanBehandleKode6: false,
      kanBehandleKode7: false,
      kanBehandleKodeEgenAnsatt: false,
    };

    const apentFaktaPanelInfo = undefined;

    const hasFetchError = false;
    const valgtProsessSteg = 'default';
    const intl = { formatMessage: (data) => data.id };

    // ACT
    const wrapper = testHook(() => prosessStegHooks.useProsessStegPaneler(
      prosessStegPanelDefinisjoner, ekstraPanelData, fagsak, navAnsatt, behandling,
      aksjonspunkter, vilkar, hasFetchError, intl, valgtProsessSteg, apentFaktaPanelInfo,
    ));
    const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = Object.values(
      wrapper.find('div').prop('values'),
    ).reduce((acc, value) => [...acc, value], []);

    const paneler = [{
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      prosessStegTittelKode: 'Behandlingspunkt.Opplysningsplikt',
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
        ],
        aksjonspunkter,
        code: 'opplysningsplikt',
        endpoints: [],
        isAksjonspunktOpen: true,
        isReadOnly: true,
        komponentData: {
          aksjonspunkter,
          isAksjonspunktOpen: true,
          isReadOnly: true,
          readOnlySubmitButton: false,
          soknad: ekstraPanelData.soknad,
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: prosessStegPanelDefinisjoner[0].panels[0].renderComponent,
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'opplysningsplikt',
    }];

    expect(prosessStegPaneler).to.eql(paneler);
    expect(valgtPanel).to.eql(paneler[0]);
    expect(formaterteProsessStegPaneler).to.eql([{
      isActive: true,
      isDisabled: false,
      isFinished: false,
      label: 'Behandlingspunkt.Opplysningsplikt',
      type: StepType.warning,
    }]);
  });

  it('skal velge første prosess-steg', () => {
    const prosessStegPaneler = [{
      urlCode: 'opplysningsplikt',
      label: 'Behandlingspunkt.Opplysningsplikt',
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
        ],
        aksjonspunkter,
        code: 'opplysningsplikt',
        endpoints: [],
        isAksjonspunktOpen: true,
        isReadOnly: true,
        renderComponent: () => <div>test</div>,
        status: vilkarUtfallType.IKKE_VURDERT,
        komponentData: {
          aksjonspunkter,
          isAksjonspunktOpen: true,
          isReadOnly: true,
          readOnlySubmitButton: false,
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
      }],
    }];
    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'default';

    const wrapper = testHook(() => prosessStegHooks.useProsessStegVelger(prosessStegPaneler, valgtFaktaSteg,
      behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg));
    const prosessStegVelger = wrapper.find('div').prop('values');

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql('opplysningsplikt');
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal skjule prosess-steg når en velger steg som allerede vises', () => {
    const prosessStegPaneler = [{
      urlCode: 'opplysningsplikt',
      label: 'Behandlingspunkt.Opplysningsplikt',
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
        ],
        aksjonspunkter,
        code: 'opplysningsplikt',
        endpoints: [],
        isAksjonspunktOpen: true,
        isReadOnly: true,
        renderComponent: () => <div>test</div>,
        status: vilkarUtfallType.IKKE_VURDERT,
        komponentData: {
          aksjonspunkter,
          isAksjonspunktOpen: true,
          isReadOnly: true,
          readOnlySubmitButton: false,
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
      }],
    }];
    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'opplysningsplikt';

    const wrapper = testHook(() => prosessStegHooks.useProsessStegVelger(prosessStegPaneler, valgtFaktaSteg,
      behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg));
    const prosessStegVelger = wrapper.find('div').prop('values');

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.undefined;
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal bekrefte aksjonspunkt', () => {
    const prosessStegPanel = {
      urlCode: 'opplysningsplikt',
      label: 'Behandlingspunkt.Opplysningsplikt',
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
        ],
        aksjonspunkter,
        code: 'opplysningsplikt',
        endpoints: [],
        isAksjonspunktOpen: true,
        isReadOnly: true,
        renderComponent: () => <div>test</div>,
        status: vilkarUtfallType.IKKE_VURDERT,
        komponentData: {
          aksjonspunkter,
          isAksjonspunktOpen: true,
          isReadOnly: true,
          readOnlySubmitButton: false,
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
      }],
    };

    const dispatch = () => Promise.resolve();
    const makeRestApiRequest = sinon.spy();
    const lagringSideEffectsCallback = () => {};
    const behandlingApi = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };

    const wrapper = testHook(() => prosessStegHooks.useBekreftAksjonspunkt(fagsak, behandling, behandlingApi,
      lagringSideEffectsCallback, dispatch, prosessStegPanel));
    const bekreftAksjonspunkt = wrapper.find('div').prop('values');

    bekreftAksjonspunkt([{ kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU }]);

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
