import React from 'react';
import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';

import '@fpsak-frontend/assets/styles/global.less';

const withGlobalStyle = (story) => (
  <div style={{ margin: '40px' }}>
    { story() }
  </div>
);
addDecorator(withGlobalStyle);

addParameters({
  options: {
    theme: themes.dark,
    panelPosition: 'right',
  },
});

configure(require.context('../stories/', true, /\.stories\.js$/), module);
