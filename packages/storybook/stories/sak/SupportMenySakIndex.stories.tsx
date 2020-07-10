import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import SupportMenySakIndex, { supportTabs } from '@fpsak-frontend/sak-support-meny';

export default {
  title: 'sak/sak-support-meny',
  component: SupportMenySakIndex,
  decorators: [withKnobs],
};

export const visMenyUtenBeslutterGodkjenningOgTilbakesending = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgbareTabs={[supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
    />
  );
};

export const visMenyMedBeslutterGodkjenning = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[supportTabs.APPROVAL, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgbareTabs={[supportTabs.APPROVAL, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
    />
  );
};

export const visMenyEtterTilbakesendingFraBeslutter = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[supportTabs.RETURNED, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgbareTabs={[supportTabs.RETURNED, supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
    />
  );
};

export const visSendMeldingSomIkkeValgbar = () => {
  const [valgtPanelIndex, setPanelIndex] = React.useState<number>();
  return (
    <SupportMenySakIndex
      tilgjengeligeTabs={[supportTabs.HISTORY, supportTabs.MESSAGES, supportTabs.DOCUMENTS]}
      valgbareTabs={[supportTabs.HISTORY, supportTabs.DOCUMENTS]}
      valgtIndex={valgtPanelIndex}
      onClick={setPanelIndex}
    />
  );
};
