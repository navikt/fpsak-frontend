import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs, object, boolean, array,
} from '@storybook/addon-knobs';

import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AvregningBpIndex from '@fpsak-frontend/prosess-avregning';

import withReduxProvider from '../../decorators/withRedux';

const fagsak = {
  saksnummer: '123',
  ytelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: 'NO',
};

const simuleringResultat = {
  simuleringResultat: {
    periodeFom: '2019-01-01',
    periodeTom: '2019-01-10',
    sumFeilutbetaling: 10000,
    sumEtterbetaling: 9000,
    sumInntrekk: 10,
    ingenPerioderMedAvvik: false,
    perioderPerMottaker: [],
  },
};
const tilbakekrevingvalg = {
  videreBehandling: {
    kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
  },
  varseltekst: 'varsel-eksempel',
};

const stories = storiesOf('AvregningBpIndex', module)
  .addDecorator(withKnobs)
  .addDecorator(withReduxProvider);

stories.add('Vis aksjonspunkt VURDER_INNTREKK (5084)', () => (
  <AvregningBpIndex
    fagsak={object('fagsak', fagsak)}
    behandling={behandling}
    aksjonspunkter={object('aksjonspunkter', [{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
      },
      begrunnelse: 'test',
    }])}
    simuleringResultat={object('simuleringResultat', simuleringResultat)}
    tilbakekrevingvalg={object('tilbakekrevingvalg', tilbakekrevingvalg)}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isApOpen={boolean('isApOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    apCodes={array('apCodes', [aksjonspunktCodes.VURDER_FEILUTBETALING])}
    featureToggles={{}}
  />
));

stories.add('Vis aksjonspunkt VURDER_INNTREKK (5085)', () => (
  <AvregningBpIndex
    fagsak={object('fagsak', fagsak)}
    behandling={behandling}
    aksjonspunkter={object('aksjonspunkter', [{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_INNTREKK,
      },
      begrunnelse: 'test',
    }])}
    simuleringResultat={object('simuleringResultat', simuleringResultat)}
    tilbakekrevingvalg={object('tilbakekrevingvalg', tilbakekrevingvalg)}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    isApOpen={boolean('isApOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    apCodes={array('apCodes', [aksjonspunktCodes.VURDER_INNTREKK])}
    featureToggles={{}}
  />
));
