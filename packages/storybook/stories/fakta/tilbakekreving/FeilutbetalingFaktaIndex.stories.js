import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import withReduxProvider from '../../../decorators/withRedux';

const BEHANDLING_AARSAK_KODEVERK = 'BEHANDLING_AARSAK';
const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';
const BEHANDLING_RESULTAT_TYPE_KODEVERK = 'BEHANDLING_RESULTAT_TYPE';
const KONSEKVENS_FOR_YTELSEN_KODEVERK = 'KONSEKVENS_FOR_YTELSEN';

const behandling = {
  id: 1,
  versjon: 1,
};

const feilutbetalingFakta = {
  behandlingFakta: {
    perioder: [{
      fom: '2018-01-01',
      tom: '2019-01-01',
      belop: 1000,
    }],
    totalPeriodeFom: '2019-01-01',
    totalPeriodeTom: '2019-01-02',
    aktuellFeilUtbetaltBeløp: 10000,
    tidligereVarseltBeløp: 5000,
    behandlingÅrsaker: [{
      behandlingArsakType: {
        kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
        kodeverk: BEHANDLING_AARSAK_KODEVERK,
      },
    }],
    behandlingsresultat: {
      type: {
        kode: behandlingResultatType.INNVILGET,
        kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
      },
      konsekvenserForYtelsen: [{
        kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      }, {
        kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      }],
    },
    tilbakekrevingValg: {
      videreBehandling: {
        kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
        kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
      },
    },
    datoForRevurderingsvedtak: '2019-01-01',
  },
};

const feilutbetalingAarsak = {
  hendelseTyper: [{
    hendelseType: {
      kode: 'OPPTJENING',
      navn: '§14-6 Opptjening',
    },
    hendelseUndertyper: [],
  }, {
    hendelseType: {
      kode: 'ANNET',
      navn: 'Annet',
    },
    hendelseUndertyper: [],
  }, {
    hendelseType: {
      kode: 'MEDLEM',
      navn: '§14-2 Medlemskap',
    },
    hendelseUndertyper: [{
      kode: 'IKKE_EØS',
      navn: 'Ikke oppholdsrett EØS',
    }, {
      kode: 'IKKE_BOSATT',
      navn: 'Ikke bosatt',
    }],
  }],
};

const alleKodeverk = {
  [kodeverkTyper.BEHANDLING_AARSAK]: [{
    kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
    navn: 'Feil i lovanvendelse',
    kodeverk: BEHANDLING_AARSAK_KODEVERK,
  }],
  [kodeverkTyper.TILBAKEKR_VIDERE_BEH]: [{
    kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
    navn: 'Tilbakekreving inntrekk',
    kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
  }],
  [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [{
    kode: behandlingResultatType.INNVILGET,
    navn: 'Innvilget',
    kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
  }],
  [kodeverkTyper.KONSEKVENS_FOR_YTELSEN]: [{
    kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
    navn: 'Foreldrepenger opphører',
    kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
  }, {
    kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
    navn: 'Endring i beregning',
    kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
  }],
};

const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/tilbakekreving/fakta-feilutbetaling',
  component: FeilutbetalingFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visAksjonspunktForFeilutbetaling = () => (
  <FeilutbetalingFaktaIndex
    behandling={behandling}
    feilutbetalingFakta={object('feilutbetalingFakta', feilutbetalingFakta)}
    feilutbetalingAarsak={object('feilutbetalingAarsak', feilutbetalingAarsak)}
    aksjonspunkter={[{
      definisjon: {
        kode: aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
      kanLoses: true,
      erAktivt: true,
    }]}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    hasOpenAksjonspunkter={boolean('hasOpenAksjonspunkter', true)}
  />
);
