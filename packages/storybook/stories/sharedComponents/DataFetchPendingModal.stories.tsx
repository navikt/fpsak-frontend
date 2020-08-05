import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { DataFetchPendingModal } from '@fpsak-frontend/shared-components';

const intl = createIntl({
  locale: 'nb-NO',
  messages: {
    'DataFetchPendingModal.LosningenJobberMedBehandlingen': 'Løsningen jobber med behandlingen...',
  },
}, createIntlCache());

export default {
  title: 'sharedComponents/DataFetchPendingModal',
  component: DataFetchPendingModal,
};

export const visModalForVisningAvPågåandeRestkall = () => (
  <div style={{ width: '200px' }}>
    <RawIntlProvider value={intl}>
      <DataFetchPendingModal pendingMessage="Henting av data pågår" />
    </RawIntlProvider>
  </div>
);
