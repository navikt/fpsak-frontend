import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const alleKodeverk = {
  [kodeverkTyper.KLAGE_MEDHOLD_ARSAK]: [{
    kode: 'NYE_OPPLYSNINGER',
    navn: 'Nye opplysninger',
    kodeverk: kodeverkTyper.KLAGE_MEDHOLD_ARSAK,
  }, {
    kode: 'ULIK_REGELVERKSTOLKNING',
    navn: 'Ulik regelverkstolkning',
    kodeverk: kodeverkTyper.KLAGE_MEDHOLD_ARSAK,
  }],
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
