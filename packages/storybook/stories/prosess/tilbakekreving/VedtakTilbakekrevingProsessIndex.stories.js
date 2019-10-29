import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import vedtakResultatType from '@fpsak-frontend/fp-behandling-tilbakekreving/src/kodeverk/vedtakResultatType';
import aktsomhet from '@fpsak-frontend/prosess-tilbakekreving/src/kodeverk/aktsomhet';

import withReduxProvider from '../../../decorators/withRedux';

const vedtaksbrev = {
  avsnittsliste: [{
    avsnittstype: 'PERIODE',
    fom: '2018-01-01',
    tom: '2019-01-01',
    overskrift: 'Periode 1',
    underavsnittsliste: [{
      brødtekst: 'Dette er en brødtekst',
      fritekst: undefined,
      fritekstTillatt: true,
      overskrift: 'Dette er en overskrift',
      underavsnittstype: 'Underavsnittstype 1',
    }, {
      brødtekst: 'Dette er en brødtekst',
      fritekstTillatt: false,
      overskrift: 'Dette er en overskrift',
      underavsnittstype: 'Underavsnittstype 2',
    }],
  }, {
    avsnittstype: 'PERIODE',
    fom: '2018-10-01',
    tom: '2019-01-01',
    overskrift: 'Periode 2',
    underavsnittsliste: [{
      brødtekst: 'Dette er en brødtekst',
      fritekst: 'Dette er en fritekst',
      fritekstTillatt: true,
      overskrift: 'Dette er en overskrift',
      underavsnittstype: 'Dette er en underavsnittstype',
    }],
  }, {
    avsnittstype: 'FAKTA',
    fom: '2018-10-01',
    tom: '2019-01-01',
    overskrift: 'Fakta',
    underavsnittsliste: [{
      brødtekst: 'Dette er en brødtekst',
      fritekstTillatt: false,
      overskrift: 'Dette er en overskrift',
      underavsnittstype: 'Dette er en underavsnittstype',
    }],
  }],
};

const beregningsresultat = {
  beregningResultatPerioder: [{
    periode: {
      fom: '2018-10-01',
      tom: '2019-01-01',
    },
    feilutbetaltBeløp: 10000,
    vurdering: {
      kode: aktsomhet.FORSETT,
      kodeverk: 'AKTSOMHET',
    },
    andelAvBeløp: 50,
    renterProsent: 0,
    tilbakekrevingBeløp: 5000,
    tilbakekrevingBeløpEtterSkatt: 4000,
  }, {
    periode: {
      fom: '2018-01-01',
      tom: '2019-01-01',
    },
    feilutbetaltBeløp: 1000,
    vurdering: {
      kode: aktsomhet.FORSETT,
      kodeverk: 'AKTSOMHET',
    },
    andelAvBeløp: 50,
    renterProsent: 80,
    tilbakekrevingBeløp: 500,
    tilbakekrevingBeløpEtterSkatt: 400,
  }],
  vedtakResultatType: {
    kode: vedtakResultatType.DELVIS_TILBAKEBETALING,
    kodeverk: 'VEDTAK_RESULTAT_TYPE',
  },
};

const alleKodeverk = {
  [kodeverkTyper.VEDTAK_RESULTAT_TYPE]: [{
    kode: vedtakResultatType.DELVIS_TILBAKEBETALING,
    navn: 'Delvis tilbakebetaling',
    kodeverk: 'VEDTAK_RESULTAT_TYPE',
  }],
  [kodeverkTyper.AKTSOMHET]: [{
    kode: aktsomhet.FORSETT,
    navn: 'Forsett',
    kodeverk: 'AKTSOMHET',
  }],
};


export default {
  title: 'prosess/tilbakekreving/VedtakTilbakekrevingProsessIndex',
  component: VedtakTilbakekrevingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visVedtakspanel = () => (
  <VedtakTilbakekrevingProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
    }}
    beregningsresultat={beregningsresultat}
    vedtaksbrev={vedtaksbrev}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isBehandlingHenlagt={boolean('isBehandlingHenlagt', false)}
    alleKodeverk={alleKodeverk}
    fetchPreviewVedtaksbrev={action('button-click')}
    aksjonspunktKodeForeslaVedtak={aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK}
  />
);
