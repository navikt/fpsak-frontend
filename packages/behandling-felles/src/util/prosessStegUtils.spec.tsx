import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Dispatch } from 'redux';

import { EndpointOperations } from '@fpsak-frontend/rest-api-redux';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { prosessStegCodes as bpc } from '@fpsak-frontend/konstanter';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { Behandling } from '@fpsak-frontend/types';

import {
  utledProsessStegPaneler, getBekreftAksjonspunktCallback, formaterPanelerForProsessmeny, finnValgtPanel,
} from './prosessStegUtils';

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

  const testPanelData = {
    aksjonspunkter: [],
    erStegBehandlet: true,
    isAksjonspunktOpen: false,
    isReadOnly: true,
    prosessStegTittelKode: 'Behandlingspunkt.Test',
    panelData: [{
      aksjonspunktHelpTextCodes: [],
      aksjonspunkter: [],
      code: 'test',
      endpoints: [],
      isAksjonspunktOpen: false,
      isReadOnly: true,
      komponentData: {
        aksjonspunkter: [],
        isAksjonspunktOpen: false,
        isReadOnly: true,
        readOnlySubmitButton: false,
        status: vilkarUtfallType.OPPFYLT,
        vilkar: [],
      },
      renderComponent: sinon.spy(),
      status: vilkarUtfallType.OPPFYLT,
    },
    ],
    status: vilkarUtfallType.OPPFYLT,
    urlCode: 'test',
  };

  it('skal utlede prosess-steg-paneler', () => {
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
    const toggleOverstyring = () => undefined;
    const overstyrteAksjonspunktKoder = [];

    // ACT
    const prosessStegPaneler = utledProsessStegPaneler(prosessStegPanelDefinisjoner, ekstraPanelData, toggleOverstyring, overstyrteAksjonspunktKoder,
      fagsak, behandling as Behandling, aksjonspunkter, vilkar, rettigheter, hasFetchError);

    expect(prosessStegPaneler).to.have.length(1);
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
  });

  it('skal vise valgt panel', () => {
    const paneler = [testPanelData, {
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      label: 'Behandlingspunkt.Opplysningsplikt',
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
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: sinon.spy(),
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'opplysningsplikt',
      prosessStegTittelKode: 'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
    }, testPanelData];
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel(paneler, erBehandlingHenlagt, 'opplysningsplikt', apentFaktaPanelInfo);

    expect(valgtPanel).to.eql(paneler[1]);
  });

  it('skal vise vedtakspanel når behandling er henlagt', () => {
    const paneler = [testPanelData, {
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      label: 'Behandlingspunkt.Vedtak',
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'vedtak.UtfyllendeOpplysninger',
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
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: sinon.spy(),
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'vedtak',
      prosessStegTittelKode: 'Behandlingspunkt.Vedtak',
    }];
    const erBehandlingHenlagt = true;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel(paneler, erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).to.eql(paneler[1]);
  });

  it('skal vise ikke vise prosess-steg panel når ingen er spesifikt valgt og en har åpent fakta-aksjonspunkt', () => {
    const paneler = [testPanelData, {
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      label: 'Behandlingspunkt.Vedtak',
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'vedtak.UtfyllendeOpplysninger',
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
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: sinon.spy(),
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'vedtak',
      prosessStegTittelKode: 'Behandlingspunkt.Vedtak',
    }];
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = { urlCode: 'FODSEL', textCode: 'Fakta.Test' };

    const valgtPanel = finnValgtPanel(paneler, erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).is.undefined;
  });

  it('skal vise panel som har åpent aksjonspunkt', () => {
    const paneler = [testPanelData, {
      aksjonspunkter,
      erStegBehandlet: true,
      isAksjonspunktOpen: true,
      isReadOnly: true,
      label: 'Behandlingspunkt.Vedtak',
      panelData: [{
        aksjonspunktHelpTextCodes: [
          'vedtak.UtfyllendeOpplysninger',
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
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: sinon.spy(),
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'vedtak',
      prosessStegTittelKode: 'Behandlingspunkt.Vedtak',
    }];
    const erBehandlingHenlagt = false;
    const apentFaktaPanelInfo = undefined;

    const valgtPanel = finnValgtPanel(paneler, erBehandlingHenlagt, 'default', apentFaktaPanelInfo);

    expect(valgtPanel).is.eql(paneler[1]);
  });

  it('skal formatere paneler for prosessmeny', () => {
    const paneler = [testPanelData, {
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
          status: vilkarUtfallType.IKKE_VURDERT,
          vilkar,
        },
        renderComponent: sinon.spy(),
        status: vilkarUtfallType.IKKE_VURDERT,
      },
      ],
      status: vilkarUtfallType.IKKE_VURDERT,
      urlCode: 'opplysningsplikt',
    }];
    const intl = { formatMessage: (data) => data.id };
    const formatertePaneler = formaterPanelerForProsessmeny(paneler, intl, 'opplysningsplikt');
    expect(formatertePaneler).to.eql([{
      isActive: false,
      isDisabled: false,
      isFinished: true,
      label: 'Behandlingspunkt.Test',
      type: 'success',
    }, {
      isActive: true,
      isDisabled: false,
      isFinished: false,
      label: 'Behandlingspunkt.Opplysningsplikt',
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
