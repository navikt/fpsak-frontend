import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';

import withReduxProvider from '../../../decorators/withRedux';

const alleKodeverk = require('../../mocks/alleKodeverk.json'); // eslint-disable-line

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

export default {
  title: 'prosess/klage/prosess-klagevurdering',
  component: KlagevurderingProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForKlagevurderingMedAksjonspunktNk = () => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [{
          navn: 'Denne er avvist fordi...',
        }],
      },
    })}
    apCodes={[aksjonspunktCodes.BEHANDLE_KLAGE_NK]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    previewCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);

export const visPanelForKlagevurderingMedAksjonspunktNfp = () => (
  <KlagevurderingProsessIndex
    behandling={behandling}
    klageVurdering={object('klageVurdering', {
      klageVurderingResultatNK: {
        klageVurdertAv: 'NK',
        klageVurdering: klageVurderingCodes.AVVIS_KLAGE,
        fritekstTilBrev: 'test',
        klageMedholdArsakNavn: 'TEST',
        godkjentAvMedunderskriver: false,
      },
      klageFormkravResultatKA: {
        avvistArsaker: [{
          navn: 'Denne er avvist fordi...',
        }],
      },
    })}
    apCodes={[aksjonspunktCodes.BEHANDLE_KLAGE_NFP]}
    saveKlage={action('button-click')}
    submitCallback={action('button-click')}
    readOnly={boolean('readOnly', false)}
    previewCallback={action('button-click')}
    readOnlySubmitButton={boolean('readOnly', false)}
    alleKodeverk={alleKodeverk}
  />
);
