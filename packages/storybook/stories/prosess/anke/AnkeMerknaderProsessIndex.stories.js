import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import ankeVurdering from '@fpsak-frontend/kodeverk/src/ankeVurdering';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AnkeMerknaderProsessIndex from '@fpsak-frontend/prosess-anke-merknader';

import withReduxProvider from '../../../decorators/withRedux';

const behandling = {
  id: 1,
  versjon: 1,
};

const aksjonspunkter = [{
  definisjon: {
    kode: aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE_MERKNADER,
  },
  status: {
    kode: aksjonspunktStatus.OPPRETTET,
  },
  begrunnelse: undefined,
}];

export default {
  title: 'prosess/anke/prosess-anke-merknader',
  component: AnkeMerknaderProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForResultatVedStadfestYtelsesvedtak = () => (
  <AnkeMerknaderProsessIndex
    behandling={behandling}
    ankeVurdering={object('ankeVurdering', {
      ankeVurderingResultat: {
        ankeVurdering: ankeVurdering.ANKE_STADFESTE_YTELSESVEDTAK,
        begrunnelse: 'Dette er en begrunnelse',
      },
    })}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    saveAnke={action('button-click')}
    previewCallback={action('button-click')}
    previewVedtakCallback={action('button-click')}
  />
);
