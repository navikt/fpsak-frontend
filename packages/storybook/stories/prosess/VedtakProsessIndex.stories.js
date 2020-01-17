import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
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
  },
  status: {
    kode: behandlingStatus.BEHANDLING_UTREDES,
  },
  sprakkode: {
    kode: 'NO',
  },
  behandlingsresultat: {
    vedtaksbrev: {
      kode: 'FRITEKST',
    },
    type: {
      kode: behandlingResultatType.INNVILGET,
    },
  },
  behandlingPaaVent: false,
  behandlingHenlagt: false,
  behandlingArsaker: [{
    behandlingArsakType: {
      kode: klageBehandlingArsakType.ETTER_KLAGE,
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
  },
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

export const visÅpentAksjonspunktOgInnvilgetForForeldrepenger = () => (
  <VedtakProsessIndex
    behandling={behandling}
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

export const visAvslagForForeldrepenger = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
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

export const visÅpentAksjonspunktForSvangerskapspenger = () => (
  <VedtakProsessIndex
    behandling={behandling}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    ytelseType={{ kode: fagsakYtelseType.SVANGERSKAPSPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visModalForObligatoriskFritekstbrevForSvangerskapspenger = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
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
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    ytelseType={{ kode: fagsakYtelseType.SVANGERSKAPSPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visÅpentAksjonspunktForEngangsstønad = () => (
  <VedtakProsessIndex
    behandling={behandling}
    vilkar={vilkar}
    beregningresultatEngangsstonad={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    ytelseType={{ kode: fagsakYtelseType.ENGANGSSTONAD }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visAtBehandlingErHenlagt = () => (
  <VedtakProsessIndex
    behandling={{
      ...behandling,
      behandlingHenlagt: true,
    }}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.FORESLA_VEDTAK,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
  />
);

export const visInnvilgetForForeldrepengerRevurdering = () => (
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
          kode: behandlingResultatType.INNVILGET,
        },
      },
    }}
    vilkar={vilkar}
    beregningresultatForeldrepenger={resultatstruktur}
    sendVarselOmRevurdering={boolean('sendVarselOmRevurdering', false)}
    resultatstrukturOriginalBehandling={resultatstrukturOriginalBehandling}
    medlemskap={{ fom: '2019-01-01' }}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodes.VURDERE_ANNEN_YTELSE,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    tilbakekrevingvalg={{
      videreBehandling: {
        kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
        kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
      },
    }}
    ytelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
    employeeHasAccess={boolean('employeeHasAccess', false)}
    isReadOnly={boolean('isReadOnly', false)}
    previewCallback={action('button-click')}
    submitCallback={action('button-click')}
    alleKodeverk={alleKodeverk}
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
