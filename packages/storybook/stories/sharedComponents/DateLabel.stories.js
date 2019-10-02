import React from 'react';

import { DateLabel } from '@fpsak-frontend/shared-components';

import withIntlMessages from '../../decorators/withIntlMessages';

export default {
  title: 'sharedComponents/DateLabel',
  component: DateLabel,
  decorators: [withIntlMessages],
};

export const visFormatertDato = () => (
  <DateLabel
    dateString="2017-10-02"
  />
);
