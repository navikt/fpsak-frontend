import { configure } from '@storybook/react';

function loadStories() {
  require('../stories/sharedComponents.js');
  require('../stories/prosess/avregning.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);