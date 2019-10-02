import React from 'react';
import { action } from '@storybook/addon-actions';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import withIntlMessages from '../../decorators/withIntlMessages';

export default {
  title: 'sharedComponents/OkAvbrytModal',
  component: OkAvbrytModal,
  decorators: [withIntlMessages],
};

export const visModal = () => (
  <OkAvbrytModal
    textCode="OpenBehandlingForChangesMenuItem.OpenBehandling"
    showModal
    submit={action('button-click')}
    cancel={action('button-click')}
  />
);
