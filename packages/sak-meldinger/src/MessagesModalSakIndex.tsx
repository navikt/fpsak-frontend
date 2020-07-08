import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import MessagesModal from './components/MessagesModal';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

interface OwnProps {
  showModal: boolean;
  closeEvent: () => void;
}

const MessagesModalSakIndex: FunctionComponent<OwnProps> = ({
  showModal,
  closeEvent,
}) => (
  <RawIntlProvider value={intl}>
    <MessagesModal
      showModal={showModal}
      closeEvent={closeEvent}
    />
  </RawIntlProvider>
);

export default MessagesModalSakIndex;
