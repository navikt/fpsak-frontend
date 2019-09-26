import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { DateLabel } from '@fpsak-frontend/shared-components';

const intl = createIntl({
  locale: 'nb-NO',
  messages: {
    'OkAvbrytModal.Ok': 'Ok',
    'OkAvbrytModal.Avbryt': 'Avbryt',
    'Test.Test': 'Dette er ein test',
  },
}, createIntlCache());

export default {
  title: 'sharedComponents/DateLabel',
  component: DateLabel,
};

export const visFormatertDato = () => (
  <RawIntlProvider value={intl}>
    <DateLabel
      dateString="2017-10-02"
    />
  </RawIntlProvider>
);
