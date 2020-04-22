import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { Behandling, BeregningsresultatEs, Beregningsgrunnlag } from '@fpsak-frontend/types';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';

const behandling = {
  id: 1,
  versjon: 1,
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
    kodeverk: '',
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
    kodeverk: '',
  },
  sprakkode: {
    kode: 'NO',
    kodeverk: '',
  },
  behandlingsresultat: {
    type: {
      kode: behandlingResultatType.INNVILGET,
      kodeverk: '',
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [{
    behandlingArsakType: {
      kode: behandlingArsakType.ANNET,
      kodeverk: '',
    },
  }],
};

const vilkar = [{
  lovReferanse: '§§Dette er en lovreferanse',
  vilkarType: {
    kode: vilkarType.FODSELSVILKARET_MOR,
    kodeverk: kodeverkTyper.VILKAR_TYPE,
  },
  vilkarStatus: {
    kode: vilkarUtfallType.OPPFYLT,
    kodeverk: '',
  },
  overstyrbar: true,
}];

const resultatstruktur = {
  antallBarn: 1,
  beregnetTilkjentYtelse: 10000,
};
const resultatstrukturOriginalBehandling = {};

export default {
  title: 'prosess/prosess-vedtak',
  component: VedtakProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

/*
 * Førstegangssøknad - Foreldrepenger
 */

export const visInnvilgetForeldrepengerTilGodkjenningForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentForeldrepengerForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visInnvilgetForeldrepengerTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentForeldrepengerForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentForeldrepengerMedManueltBrevForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
      behandlingsresultat: {
        vedtaksbrev: {
          kode: 'FRITEKST',
          kodeverk: '',
        },
        overskrift: 'Dette er en overskrift',
        fritekstbrev: 'Dette er innholdet i brevet',
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visAvslåttForeldrepengerTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
        avslagsarsakFritekst: 'Dette er ein fritekst',
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentAvslagForForeldrepengerForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visInnvilgetForeldrepengerDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningsgrunnlag={{
      beregningsgrunnlagPeriode: [{
        beregningsgrunnlagPrStatusOgAndel: [{
          overstyrtPrAar: 0,
        }],
      }],
    } as Beregningsgrunnlag}
  />
);

export const visAvslåttForeldrepengerDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
        avslagsarsakFritekst: 'Dette er ein fritekst',
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningsgrunnlag={{
      beregningsgrunnlagPeriode: [{
        beregningsgrunnlagPrStatusOgAndel: [{
          overstyrtPrAar: 0,
        }],
      }],
    } as Beregningsgrunnlag}
  />
);

export const visTeksterForAksjonspunkterSomSaksbehandlerMåTaStillingTil = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        kodeverk: '',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: '',
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }, {
      definisjon: {
        kode: aksjonspunktCodes.VURDERE_DOKUMENT,
        kodeverk: '',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: '',
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }, {
      definisjon: {
        kode: aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
        kodeverk: '',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: '',
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);


/*
 * Førstegangssøknad - Engangsstøand
 */

export const visInnvilgetEngangsstønadTilGodkjenningForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningresultatEngangsstonad={{
      antallBarn: 2,
      beregnetTilkjentYtelse: 10000,
    } as BeregningsresultatEs}
  />
);

export const visGodkjentEngangsstønadForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
    } as Behandling}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningresultatEngangsstonad={{
      antallBarn: 2,
      beregnetTilkjentYtelse: 10000,
    } as BeregningsresultatEs}
  />
);

export const visInnvilgetEngangsstønadTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningresultatEngangsstonad={{
      antallBarn: 2,
      beregnetTilkjentYtelse: 10000,
    } as BeregningsresultatEs}
  />
);

export const visInnvilgetEngangsstønadDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningresultatEngangsstonad={{
      antallBarn: 2,
      beregnetTilkjentYtelse: 10000,
    } as BeregningsresultatEs}
    beregningsgrunnlag={{
      beregningsgrunnlagPeriode: [{
        beregningsgrunnlagPrStatusOgAndel: [{
          overstyrtPrAar: 0,
        }],
      }],
    } as Beregningsgrunnlag}
  />
);

export const visAvslåttEngangsstønadDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
        avslagsarsakFritekst: 'Dette er ein fritekst',
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    beregningresultatEngangsstonad={{
      antallBarn: 2,
      beregnetTilkjentYtelse: 10000,
    } as BeregningsresultatEs}
    beregningsgrunnlag={{
      beregningsgrunnlagPeriode: [{
        beregningsgrunnlagPrStatusOgAndel: [{
          overstyrtPrAar: 0,
        }],
      }],
    } as Beregningsgrunnlag}
  />
);

/*
 * Førstegangssøknad - Svangerskapspenger
 */

export const visInnvilgetSvangerskapspengerTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visAvslåttSvangerskapspengerOgVisModal = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
    kanOverstyre
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

/*
 * Revurdering - Foreldrepenger
 */


export const visInnvilgetRevurderingForeldrepengerTilGodkjenningForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={behandling as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentRevurderingForeldrepengerForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        vedtaksbrev: {
          kode: 'FRITEKST',
          kodeverk: '',
        },
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
        kodeverk: '',
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
        kodeverk: '',
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    isReadOnly
    beregningsresultatOriginalBehandling={resultatstrukturOriginalBehandling}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    kanOverstyre={false}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    tilbakekrevingvalg={{
      videreBehandling: {
        kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
        kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
      },
    }}
  />
);

export const visOpphørtForForeldrepengerRevurdering = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
      },
      behandlingsresultat: {
        vedtaksbrev: {
          kode: 'FRITEKST',
        },
        type: {
          kode: behandlingResultatType.OPPHOR,
        },
      },
    }}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visInnvilgetForEngangsstønadRevurdering = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
      },
    }}
    vilkar={vilkar}
    beregningresultatEngangsstonad={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visAvslåttForEngangsstønadRevurdering = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
      },
      behandlingsresultat: {
        vedtaksbrev: {
          kode: 'FRITEKST',
        },
        type: {
          kode: behandlingResultatType.AVSLATT,
        },
        avslagsarsak: {
          kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          kodeverk: kodeverkTyper.AVSLAGSARSAK,
        },
      },
    }}
    vilkar={[{
      ...vilkar[0],
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
      },
    }]}
    beregningresultatEngangsstonad={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);
