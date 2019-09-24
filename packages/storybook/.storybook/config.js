import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/sharedComponents.js');
  require('../stories/prosess/avregning.js');
  require('../stories/prosess/beregningsresultat.js');
  require('../stories/prosess/varselOmRevurdering.js');
  require('../stories/prosessOgFakta/fodselSammenligning.js');
}

configure(loadStories, module);