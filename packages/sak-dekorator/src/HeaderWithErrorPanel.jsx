import React from 'react';
import PropTypes from 'prop-types';
import BoxedListWithLinks from '@navikt/boxed-list-with-links';
import Header from '@navikt/nap-header';

import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import ErrorMessagePanel from './ErrorMessagePanel';

import messages from '../i18n/nb_NO';

import styles from './headerWithErrorPanel.less';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);
/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel = ({
  iconLinks,
  systemTittel,
  navAnsattName,
  removeErrorMessage,
  queryStrings,
  showDetailedErrorMessages,
  errorMessages,
}) => (
  <header className={styles.container}>
    <RawIntlProvider value={intl}>
      <Header
        title={systemTittel}
        titleHref="/"
        userName={navAnsattName}
        renderLinksPopoverContent={() => (
          <BoxedListWithLinks
            items={iconLinks.map((link) => ({
              name: link.text,
              href: link.url,
              isExternal: true,
            }))}
          />
        )}
      />
      <ErrorMessagePanel
        queryStrings={queryStrings}
        removeErrorMessage={removeErrorMessage}
        showDetailedErrorMessages={showDetailedErrorMessages}
        errorMessages={errorMessages}
      />
    </RawIntlProvider>
  </header>
);

HeaderWithErrorPanel.propTypes = {
  iconLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  systemTittel: PropTypes.string.isRequired,
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  showDetailedErrorMessages: PropTypes.bool,
  errorMessages: PropTypes.arrayOf(PropTypes.shape()),
};

HeaderWithErrorPanel.defaultProps = {
  showDetailedErrorMessages: false,
  errorMessages: [],
};
export default HeaderWithErrorPanel;
