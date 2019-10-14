import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';
import kontrollresultatKode from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/kontrollresultatKode';
import faresignalVurdering from '@fpsak-frontend/sak-risikoklassifisering/src/kodeverk/faresignalVurdering';

import withReduxProvider from '../../decorators/withRedux';

const withWidthProvider = (story) => (
  <div style={{ width: '600px' }}>
    { story() }
  </div>
);

export default {
  title: 'sak/RisikoklassifiseringSakIndex',
  component: RisikoklassifiseringSakIndex,
  decorators: [withKnobs, withReduxProvider, withWidthProvider],
};

export const visPanelUtenInformasjon = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    isPanelOpen={boolean('isPanelOpen', false)}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkter={action('button-click')}
    toggleRiskPanel={action('button-click')}
  />
);

export const visPanelForLavRisikoklassifisering = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    risikoklassifisering={{
      kontrollresultat: {
        kode: kontrollresultatKode.IKKE_HOY,
      },
    }}
    isPanelOpen={boolean('isPanelOpen', false)}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkter={action('button-click')}
    toggleRiskPanel={action('button-click')}
  />
);

export const visPanelForHøyRisikoklassifisering = () => (
  <RisikoklassifiseringSakIndex
    behandlingId={1}
    behandlingVersjon={1}
    aksjonspunkt={{
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FARESIGNALER,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
      begrunnelse: undefined,
    }}
    risikoklassifisering={{
      kontrollresultat: {
        kode: kontrollresultatKode.HOY,
      },
      faresignalVurdering: {
        kode: faresignalVurdering.INNVIRKNING,
      },
    }}
    readOnly={boolean('readOnly', false)}
    submitAksjonspunkter={action('button-click')}
    isPanelOpen
    toggleRiskPanel={action('button-click')}
  />
);
