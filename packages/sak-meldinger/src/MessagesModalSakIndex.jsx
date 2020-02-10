import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import MessagesModal from './components/MessagesModal';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const MessagesModalSakIndex = ({
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

MessagesModalSakIndex.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
};

export default MessagesModalSakIndex;
