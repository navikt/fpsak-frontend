import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { Dispatch } from 'redux';
import { StepType } from '@navikt/nap-process-menu/dist/Step';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import { prosessStegCodes } from '@fpsak-frontend/konstanter';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Behandling } from '@fpsak-frontend/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';
import { ProsessStegUtledet, ProsessStegPanelUtledet } from './ProsessStegUtledet';
import prosessStegHooks from './prosessStegHooks';

const HookWrapper = ({ callback }) => <div data-values={callback()} />;

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

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

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

  it('skal utlede prosesstegpaneler, valgt panel og paneler formatert for meny', () => {
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

    const apentFaktaPanelInfo = undefined;

    const hasFetchError = false;
    const valgtProsessSteg = 'default';

    // ACT
    const wrapper = testHook(() => prosessStegHooks.useProsessStegPaneler(
      [new OpplysningspliktProsessStegPanelDef()], ekstraPanelData, fagsak, rettigheter, behandling as Behandling,
      aksjonspunkter, vilkar, hasFetchError, valgtProsessSteg, apentFaktaPanelInfo,
    ));
    // @ts-ignore
    const [prosessStegPaneler, valgtPanel, formaterteProsessStegPaneler] = Object.values({
      ...wrapper.find('div').prop('data-values'),
      // @ts-ignore
    }).reduce((acc, value) => [...acc, value], []);

    expect(prosessStegPaneler).has.length(1);
    const panel = prosessStegPaneler[0];
    expect(valgtPanel).to.eql(panel);
    expect(formaterteProsessStegPaneler).to.eql([{
      isActive: true,
      isDisabled: false,
      isFinished: false,
      labelId: 'Behandlingspunkt.Opplysningsplikt',
      type: StepType.warning,
    }]);
  });

  it('skal velge første prosess-steg', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'default';

    const wrapper = testHook(() => prosessStegHooks.useProsessStegVelger([utledetPanel], valgtFaktaSteg,
      behandling as Behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg));
    const prosessStegVelger = wrapper.find('div').prop('data-values') as (number) => void;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.eql('opplysningsplikt');
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal skjule prosess-steg når en velger steg som allerede vises', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    const valgtProsessSteg = 'opplysningsplikt';

    const wrapper = testHook(() => prosessStegHooks.useProsessStegVelger([utledetPanel], valgtFaktaSteg,
      behandling as Behandling, oppdaterProsessStegOgFaktaPanelIUrl, valgtProsessSteg));
    const prosessStegVelger = wrapper.find('div').prop('data-values') as (number) => void;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).to.have.length(1);
    expect(opppdaterKall[0].args).to.have.length(2);
    expect(opppdaterKall[0].args[0]).to.undefined;
    expect(opppdaterKall[0].args[1]).to.eql('default');
  });

  it('skal bekrefte aksjonspunkt', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(stegDef, panelDef, isReadOnlyCheck, aksjonspunkter, vilkar, {},
      toggleOverstyring, kanOverstyreAccess, []);
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const dispatch = () => Promise.resolve();
    const makeRestApiRequest = sinon.spy();
    const lagringSideEffectsCallback = () => () => {};
    const behandlingApi: Partial<{[name: string]: Partial<EndpointOperations>}> = {
      SAVE_AKSJONSPUNKT: {
        makeRestApiRequest: () => (data) => makeRestApiRequest(data),
      },
    };

    const wrapper = testHook(() => prosessStegHooks.useBekreftAksjonspunkt(fagsak, behandling as Behandling,
      behandlingApi as {[name: string]: EndpointOperations},
      lagringSideEffectsCallback, dispatch as Dispatch, utledetPanel));
    const bekreftAksjonspunkt = wrapper.find('div').prop('data-values') as (number) => void;

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
