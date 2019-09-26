import { configure } from '@storybook/react';
import '@fpsak-frontend/assets/styles/global.less';

function loadStories() {
  require('../stories/sharedComponents.js');
  require('../stories/prosess/avregning.js');
  require('../stories/prosess/beregningsresultat.js');
  require('../stories/prosess/varselOmRevurdering.js');
  require('../stories/prosessOgFakta/fodselSammenligning.js');
  require('../stories/fakta/fodsel.js');
}

configure(loadStories, module);