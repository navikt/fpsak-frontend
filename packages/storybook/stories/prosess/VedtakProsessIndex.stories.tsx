import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { Behandling, BeregningsresultatEs, Beregningsgrunnlag } from '@fpsak-frontend/types';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

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
      kodeverk: 'BEHANDLING_AARSAK',
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
      toTrinnsBehandling: true,
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
      toTrinnsBehandling: true,
    }]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
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
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

/*
 * Revurdering - Foreldrepenger
 */

export const visInnvilgetRevurderingForeldrepengerTilGodkjenningForSaksbehandlerUtenOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }, {
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHORER,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }, {
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHORER,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visInnvilgetRevurderingForeldrepengerTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }, {
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHORER,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentRevurderingForeldrepengerForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      status: {
        kode: behandlingStatus.AVSLUTTET,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }, {
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHORER,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentRevurderingForeldrepengerMedManueltBrevForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
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
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.FORELDREPENGER_OPPHORER,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visAvslåttRevurderingForeldrepengerTilGodkjenningForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
        avslagsarsakFritekst: 'Dette er ein fritekst',
      },
    } as Behandling}
    beregningsresultatOriginalBehandling={{
      'beregningsresultat-foreldrepenger': {
        ...resultatstruktur,
      },
    }}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visGodkjentRevurderingAvslagForForeldrepengerForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
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
    beregningsresultatOriginalBehandling={{
      'beregningsresultat-foreldrepenger': {
        ...resultatstruktur,
      },
    }}
    vilkar={vilkar}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    alleKodeverk={alleKodeverk as {}}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
  />
);

export const visOpphørForRevurderingForeldrepengerForSaksbehandlerMedOverstyring = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.OPPHOR,
          kodeverk: '',
        },
      },
    } as Behandling}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk as {}}
  />
);

export const visInnvilgetForRevurderingForeldrepengerDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.INNVILGET,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
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

export const visAvslåttForRevurderingForeldrepengerDerSøknadsfristvilkåretIkkeErOppfylt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.AVSLATT,
          kodeverk: '',
        },
        konsekvenserForYtelsen: [{
          kode: konsekvensForYtelsen.ENDRING_I_BEREGNING_OG_UTTAK,
          kodeverk: 'KONSEKVENS_FOR_YTELSEN',
        }],
        avslagsarsak: {
          kode: '1007',
          kodeverk: 'AVSLAGSARSAK',
        },
      },
    } as Behandling}
    beregningresultatForeldrepenger={resultatstruktur}
    vilkar={[{
      lovReferanse: '§§Dette er en lovreferanse',
      vilkarType: {
        kode: vilkarType.SOKNADFRISTVILKARET,
        kodeverk: 'VILKAR_TYPE',
      },
      vilkarStatus: {
        kode: vilkarUtfallType.IKKE_OPPFYLT,
        kodeverk: 'VILKAR_UTFALL_TYPE',
      },
      overstyrbar: true,
    }]}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[]}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
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

export const visOpphørForRevurderingForeldrepengerDerBeregningErManueltFastsatt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      type: {
        kode: behandlingType.REVURDERING,
        kodeverk: '',
      },
      behandlingsresultat: {
        type: {
          kode: behandlingResultatType.OPPHOR,
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
    ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
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
