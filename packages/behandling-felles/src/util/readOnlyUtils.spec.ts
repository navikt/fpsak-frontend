import { expect } from 'chai';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import readOnlyUtils from './readOnlyUtils';

describe('<readOnlyUtils>', () => {
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
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: false,
  }];

  const vilkar = [{
    vilkarType: { kode: vilkarType.FODSELSVILKARET_MOR, kodeverk: 'test' },
    vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
    overstyrbar: true,
  }];

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

  it('skal behandling readonly-status', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: true,
      },
    };
    const status = readOnlyUtils.harBehandlingReadOnlyStatus(behandlingMedReadOnly);
    expect(status).is.true;
  });

  it('skal ikke behandling readonly-status', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: false,
      },
    };
    const status = readOnlyUtils.harBehandlingReadOnlyStatus(behandlingMedReadOnly);
    expect(status).is.false;
  });

  it('skal ikke være readonly', () => {
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.false;
  });

  it('skal være readonly når en ikke har rettighet', () => {
    const nyNavAnsatt = {
      ...navAnsatt,
      kanSaksbehandle: false,
    };
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkter, vilkar, nyNavAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når en har fetch error', () => {
    const hasFetchError = true;
    const erReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når en har tastStatus.readOnly', () => {
    const behandlingMedReadOnly = {
      ...behandling,
      taskStatus: {
        readOnly: true,
      },
    };
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(behandlingMedReadOnly, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når en har minst ett ikke aktivt aksjonspunkt', () => {
    const nyeAksjonspunkter = [{
      ...aksjonspunkter[0],
      erAktivt: false,
    }];
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(behandling, nyeAksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når en har minst ett ikke overstyrbart vilkar', () => {
    const nyeVilkar = [{
      ...vilkar[0],
      overstyrbar: false,
    }];
    const hasFetchError = false;
    const erReadOnly = readOnlyUtils.erReadOnly(behandling, aksjonspunkter, nyeVilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når behandlingen har status AVSLUTTET', () => {
    const nyBehandling = {
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: 'BEHANDLING_STATUS',
      },
    };
    const hasFetchError = false;

    const erReadOnly = readOnlyUtils.erReadOnly(nyBehandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når behandlingen har status IVERKSETTER_VEDTAK', () => {
    const nyBehandling = {
      ...behandling,
      status: {
        kode: behandlingStatus.IVERKSETTER_VEDTAK,
        kodeverk: 'BEHANDLING_STATUS',
      },
    };
    const hasFetchError = false;

    const erReadOnly = readOnlyUtils.erReadOnly(nyBehandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });

  it('skal være readonly når behandlingen har status FATTER_VEDTAK', () => {
    const nyBehandling = {
      ...behandling,
      status: {
        kode: behandlingStatus.FATTER_VEDTAK,
        kodeverk: 'BEHANDLING_STATUS',
      },
    };
    const hasFetchError = false;

    const erReadOnly = readOnlyUtils.erReadOnly(nyBehandling, aksjonspunkter, vilkar, navAnsatt, fagsak, hasFetchError);

    expect(erReadOnly).is.true;
  });
});
