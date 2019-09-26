import { configure } from '@storybook/react';
import '@fpsak-frontend/assets/styles/global.less';

configure(require.context('../stories/', true, /\.stories\.js$/), module);