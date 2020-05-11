import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';

import MenyApneForEndringerIndex from '@fpsak-frontend/sak-meny-apne-for-endringer';

export default {
  title: 'sak/sak-meny-apne-for-endringer',
  component: MenyApneForEndringerIndex,
  decorators: [withKnobs],
};

export const visMenyForÅpneBehandlingForEndringer = () => (
  <MenyApneForEndringerIndex
    behandlingId={1}
    behandlingVersjon={2}
    apneBehandlingForEndringer={action('button-click')}
    lukkModal={action('button-click')}
  />
);
