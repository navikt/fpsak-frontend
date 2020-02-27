import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import SupportMenySakIndex, { supportTabs } from '@fpsak-frontend/sak-support-meny';

export default {
  title: 'sak/sak-support-meny',
  component: SupportMenySakIndex,
  decorators: [withKnobs],
};

export const vis = () => (
  <SupportMenySakIndex
    tilgjengeligeTabs={[supportTabs.APPROVAL, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
    valgbareTabs={[supportTabs.APPROVAL, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
    valgtIndex={1}
    onClick={() => undefined}
  />
);
