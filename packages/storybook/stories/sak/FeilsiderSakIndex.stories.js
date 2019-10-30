import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { ForbiddenPage, NotFoundPage, UnauthorizedPage } from '@fpsak-frontend/sak-feilsider';

import withReduxAndRouterProvider from '../../decorators/withReduxAndRouter';

export default {
  title: 'sak/FeilsiderSakIndex',
  decorators: [withKnobs, withReduxAndRouterProvider],
};

export const visPanelFor = () => (
  <ForbiddenPage />
);

export const visPanelFord = () => (
  <NotFoundPage />
);

export const visPanelFors = () => (
  <UnauthorizedPage />
);
