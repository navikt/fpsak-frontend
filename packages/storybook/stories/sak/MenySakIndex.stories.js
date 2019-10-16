import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  object, boolean, withKnobs, text,
} from '@storybook/addon-knobs';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import MenySakIndex, { MenyBehandlingData, MenyKodeverk, MenyRettigheter } from '@fpsak-frontend/sak-meny';

import withReduxProvider from '../../decorators/withRedux';

const rettigheter = {
  henleggBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  settBehandlingPaVentAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  byttBehandlendeEnhetAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opprettRevurderingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opprettNyForstegangsBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  gjenopptaBehandlingAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  opneBehandlingForEndringerAccess: {
    employeeHasAccess: true,
    isEnabled: true,
  },
  ikkeVisOpprettNyBehandling: {
    isEnabled: false,
  },
};

const fpSakKodeverk = {
  [kodeverkTyper.BEHANDLING_TYPE]: [{
    kode: BehandlingType.FORSTEGANGSSOKNAD,
    navn: 'Førstegangssøknad',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.KLAGE,
    navn: 'Klage',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.REVURDERING,
    navn: 'Revurdering',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.DOKUMENTINNSYN,
    navn: 'Innsyn',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.ANKE,
    navn: 'Anke',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.TILBAKEKREVING,
    navn: 'Tilbakekreving',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }],
  [kodeverkTyper.BEHANDLING_AARSAK]: [{
    kode: behandlingArsakType.ANNET,
    navn: 'Annet',
    kodeverk: kodeverkTyper.BEHANDLING_AARSAK,
  }],
  [kodeverkTyper.VENT_AARSAK]: [{
    kode: venteArsakType.AVV_DOK,
    navn: 'Avventer dokumentasjon',
    kodeverk: kodeverkTyper.VENT_AARSAK,
  }],
  [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [{
    kode: behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
    navn: 'Henlagt søknad trukket',
    kodeverk: kodeverkTyper.BEHANDLING_RESULTAT_TYPE,
  }, {
    kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
    navn: 'Henlagt feilopprettet',
    kodeverk: kodeverkTyper.BEHANDLING_RESULTAT_TYPE,
  }, {
    kode: behandlingResultatType.HENLAGT_SOKNAD_MANGLER,
    navn: 'Henlagt søknad mangler',
    kodeverk: kodeverkTyper.BEHANDLING_RESULTAT_TYPE,
  }, {
    kode: behandlingResultatType.MANGLER_BEREGNINGSREGLER,
    navn: 'Mangler beregningsregler',
    kodeverk: kodeverkTyper.BEHANDLING_RESULTAT_TYPE,
  }],
};
const fpTilbakeKodeverk = {
  [kodeverkTyper.BEHANDLING_TYPE]: [{
    kode: BehandlingType.TILBAKEKREVING,
    navn: 'Tilbakekreving',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }, {
    kode: BehandlingType.TILBAKEKREVING_REVURDERING,
    navn: 'Tilbakekreving revurdering',
    kodeverk: kodeverkTyper.BEHANDLING_TYPE,
  }],
  [kodeverkTyper.BEHANDLING_AARSAK]: [{
    kode: behandlingArsakType.ANNET,
    navn: 'Annet',
    kodeverk: kodeverkTyper.BEHANDLING_AARSAK,
  }],
  [kodeverkTyper.VENT_AARSAK]: [{
    kode: venteArsakType.AVV_DOK,
    navn: 'Avventer dokumentasjon',
    kodeverk: kodeverkTyper.VENT_AARSAK,
  }],
  [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [{
    kode: behandlingResultatType.HENLAGT_FEILOPPRETTET,
    navn: 'Henlagt feilopprettet',
    kodeverk: kodeverkTyper.BEHANDLING_RESULTAT_TYPE,
  }],
};

const behandlendeEnheter = [{
  enhetId: '4812',
  enhetNavn: 'NAV Familie- og pensjonsytelser Bergen',
}, {
  enhetId: '2103',
  enhetNavn: 'NAV Vikafossen',
}];

const navAnsatt = {
  navn: 'Espen Utvikler',
  brukernavn: 's232332',
  kanBehandleKode6: true,
  kanBehandleKode7: true,
  kanBehandleKodeEgenAnsatt: true,
  kanBeslutte: true,
  kanOverstyre: true,
  kanSaksbehandle: true,
  kanVeilede: false,
};

const withStyle = (story) => (
  <div style={{ marginLeft: '200px', padding: '50px', backgroundColor: 'white' }}>
    { story() }
  </div>
);

export default {
  title: 'sak/MenySakIndex',
  component: MenySakIndex,
  decorators: [withKnobs, withReduxProvider, withStyle],
};

export const visMenyDerIngenBehandlingErValgt = () => (
  <MenySakIndex
    saksnummer={1234567}
    behandlingData={MenyBehandlingData.lagIngenValgtBehandling()}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    behandlendeEnheter={behandlendeEnheter}
    navAnsatt={navAnsatt}
    erTilbakekrevingAktivert={false}
    menyKodeverk={new MenyKodeverk()
      .medFpSakKodeverk(object('fpSakKodeverk', fpSakKodeverk))
      .medFpTilbakeKodeverk(object('fpTilbakeKodeverk', fpTilbakeKodeverk))}
    rettigheter={new MenyRettigheter(object('rettigheter', rettigheter))}
    previewHenleggBehandling={action('button-click')}
    resumeBehandling={action('button-click')}
    shelveBehandling={action('button-click')}
    nyBehandlendeEnhet={action('button-click')}
    createNewBehandling={action('button-click')}
    setBehandlingOnHold={action('button-click')}
    openBehandlingForChanges={action('button-click')}
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    push={action('button-click')}
  />
);

export const visMenyDerEnHarValgtFørstegangsbehandling = () => (
  <MenySakIndex
    saksnummer={1234567}
    behandlingData={new MenyBehandlingData(
      1,
      '111-111-111',
      2,
      { kode: BehandlingType.FORSTEGANGSSOKNAD },
      boolean('erPåVent', false),
      boolean('erKøet', false),
      behandlendeEnheter[0].enhetId,
      behandlendeEnheter[0].enhetNavn,
    )}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    behandlendeEnheter={behandlendeEnheter}
    navAnsatt={navAnsatt}
    erTilbakekrevingAktivert={false}
    menyKodeverk={new MenyKodeverk({ kode: BehandlingType.FORSTEGANGSSOKNAD })
      .medFpSakKodeverk(object('fpSakKodeverk', fpSakKodeverk))
      .medFpTilbakeKodeverk(object('fpTilbakeKodeverk', fpTilbakeKodeverk))}
    rettigheter={new MenyRettigheter(object('rettigheter', rettigheter))}
    previewHenleggBehandling={action('button-click')}
    resumeBehandling={action('button-click')}
    shelveBehandling={() => { action('button-click'); return Promise.resolve(); }}
    nyBehandlendeEnhet={action('button-click')}
    createNewBehandling={action('button-click')}
    setBehandlingOnHold={action('button-click')}
    openBehandlingForChanges={action('button-click')}
    opprettVerge={action('button-click')}
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    push={action('button-click')}
  />
);

export const visMenyDerEnHarValgtTilbakekreving = () => (
  <MenySakIndex
    saksnummer={1234567}
    behandlingData={new MenyBehandlingData(
      1,
      '111-111-111',
      2,
      { kode: BehandlingType.TILBAKEKREVING },
      boolean('erPåVent', false),
      boolean('erKøet', false),
      behandlendeEnheter[0].enhetId,
      behandlendeEnheter[0].enhetNavn,
    )}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    behandlendeEnheter={behandlendeEnheter}
    navAnsatt={navAnsatt}
    kanTilbakekrevingOpprettes={{
      kanBehandlingOpprettes: boolean('kan tilbakekreving opprettes', true),
      kanRevurderingOpprettes: boolean('kan tilbakekreving-revudering opprettes', true),
    }}
    erTilbakekrevingAktivert
    uuidForSistLukkede={text('Uuid for siste lukkede', '')}
    menyKodeverk={new MenyKodeverk({ kode: BehandlingType.TILBAKEKREVING })
      .medFpSakKodeverk(object('fpSakKodeverk', fpSakKodeverk))
      .medFpTilbakeKodeverk(object('fpTilbakeKodeverk', fpTilbakeKodeverk))}
    rettigheter={new MenyRettigheter(object('rettigheter', rettigheter))}
    previewHenleggBehandling={action('button-click')}
    resumeBehandling={action('button-click')}
    shelveBehandling={() => { action('button-click'); return Promise.resolve(); }}
    nyBehandlendeEnhet={action('button-click')}
    createNewBehandling={action('button-click')}
    setBehandlingOnHold={action('button-click')}
    openBehandlingForChanges={action('button-click')}
    sjekkOmTilbakekrevingKanOpprettes={action('button-click')}
    push={action('button-click')}
  />
);
