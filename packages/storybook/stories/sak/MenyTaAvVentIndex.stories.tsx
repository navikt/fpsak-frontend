import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import MenyTaAvVentIndex from '@fpsak-frontend/sak-meny-ta-av-vent';

export default {
  title: 'sak/sak-meny-ta-av-vent',
  component: MenyTaAvVentIndex,
  decorators: [withKnobs],
};

export const visMenyForÅTaBehandlingAvVent = () => (
  <MenyTaAvVentIndex
    behandlingId={1}
    behandlingVersjon={2}
    taBehandlingAvVent={action('button-click')}
    lukkModal={action('button-click')}
  />
);
