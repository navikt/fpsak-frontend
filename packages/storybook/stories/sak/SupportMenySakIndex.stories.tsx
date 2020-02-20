import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import SupportMenySakIndex from '@fpsak-frontend/sak-support-meny';

export default {
  title: 'sak/sak-support-meny',
  component: SupportMenySakIndex,
  decorators: [withKnobs],
};

export const vis = () => (
  <SupportMenySakIndex
    erTilBeslutter
    erFraBeslutter={false}
    erSendMeldingAktiv
    onClick={() => undefined}
  />
);
