import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import TotrinnskontrollSakIndex from '@fpsak-frontend/sak-totrinnskontroll';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

import alleKodeverk from '../mocks/alleKodeverk.json';

const data = [{
  skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
  totrinnskontrollAksjonspunkter: [
    {
      aksjonspunktKode: '5082',
      opptjeningAktiviteter: [],
      beregningDto: {
        fastsattVarigEndringNaering: false,
        faktaOmBeregningTilfeller: null,
      },
      besluttersBegrunnelse: null,
      totrinnskontrollGodkjent: null,
      vurderPaNyttArsaker: [],
      uttakPerioder: [],
      arbeidforholdDtos: [],
    },
  ],
}];

const dataReadOnly = [{
  skjermlenkeType: 'FORMKRAV_KLAGE_NFP',
  totrinnskontrollAksjonspunkter: [
    {
      aksjonspunktKode: '5082',
      opptjeningAktiviteter: [],
      beregningDto: {
        fastsattVarigEndringNaering: false,
        faktaOmBeregningTilfeller: null,
      },
      besluttersBegrunnelse: 'asdfa',
      totrinnskontrollGodkjent: false,
      vurderPaNyttArsaker: [
        {
          kode: 'FEIL_REGEL',
          navn: 'Feil regelforståelse',
        },
        {
          kode: 'FEIL_FAKTA',
          navn: 'Feil fakta',
        },
      ],
      uttakPerioder: [],
      arbeidforholdDtos: [],
    },
  ],
}];

const skjemalenkeTyper = [{
  kode: 'FORMKRAV_KLAGE_NFP',
}];

export default {
  title: 'sak/sak-totrinnskontroll',
  component: TotrinnskontrollSakIndex,
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visTotrinnskontrollForBeslutter = () => (
  <div style={{
    width: '600px', margin: '50px', padding: '20px', backgroundColor: 'white',
  }}
  >
    <TotrinnskontrollSakIndex
      behandlingId={1}
      behandlingVersjon={2}
      totrinnskontrollSkjermlenkeContext={data}
      totrinnskontrollReadOnlySkjermlenkeContext={[]}
      behandlingStatus={{
        kode: behandlingStatus.FATTER_VEDTAK,
      }}
      location={{}}
      readOnly={boolean('readOnly', false)}
      onSubmit={action('button-click')}
      forhandsvisVedtaksbrev={action('button-click')}
      toTrinnsBehandling
      skjemalenkeTyper={skjemalenkeTyper}
      isForeldrepengerFagsak
      behandlingKlageVurdering={{
        klageVurderingResultatNFP: {
          klageVurdering: 'STADFESTE_YTELSESVEDTAK',
        },
      }}
      alleKodeverk={alleKodeverk}
      erBehandlingEtterKlage
      disableGodkjennKnapp={boolean('disableGodkjennKnapp', false)}
    />
  </div>
);

export const visTotrinnskontrollForSaksbehandler = () => (
  <div style={{
    width: '600px', margin: '50px', padding: '20px', backgroundColor: 'white',
  }}
  >
    <TotrinnskontrollSakIndex
      behandlingId={1}
      behandlingVersjon={2}
      totrinnskontrollSkjermlenkeContext={[]}
      totrinnskontrollReadOnlySkjermlenkeContext={dataReadOnly}
      behandlingStatus={{
        kode: behandlingStatus.BEHANDLING_UTREDES,
      }}
      location={{}}
      readOnly
      onSubmit={action('button-click')}
      forhandsvisVedtaksbrev={action('button-click')}
      toTrinnsBehandling
      skjemalenkeTyper={skjemalenkeTyper}
      isForeldrepengerFagsak
      behandlingKlageVurdering={{
        klageVurderingResultatNFP: {
          klageVurdering: 'STADFESTE_YTELSESVEDTAK',
        },
      }}
      alleKodeverk={alleKodeverk}
      erBehandlingEtterKlage
      disableGodkjennKnapp={boolean('disableGodkjennKnapp', false)}
    />
  </div>
);
