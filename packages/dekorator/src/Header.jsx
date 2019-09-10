import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';

import logoUrl from '@fpsak-frontend/assets/images/nav.svg';
import navAnsattIkonUrl from '@fpsak-frontend/assets/images/nav_ansatt.svg';
import { Systemtittel } from 'nav-frontend-typografi';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import styles from './header.less';
import messages from '../i18n/nb_NO';
import ErrorMessagePanel from './ErrorMessagePanel';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);
/**
 * Header
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const Header = ({
  iconLinks,
  systemTittel,
  navAnsattName,
  removeErrorMessage,
  queryStrings,
  showDetailedErrorMessages,
}) => (
  <header className={styles.container}>
    <RawIntlProvider value={intl}>
      <FlexContainer>
        <FlexRow className={styles.dekorator} role="banner">
          <FlexColumn className={styles.logo}>
            <Link to="/">
              <Image
                className={styles.headerIkon}
                src={logoUrl}
                alt={intl.formatMessage({ id: 'Header.LinkToMainPage' })}
                title={intl.formatMessage({ id: 'Header.LinkToMainPage' })}
              />
            </Link>
          </FlexColumn>

          <Systemtittel>{systemTittel}</Systemtittel>
          <FlexColumn className="justifyItemsToFlexEnd">
            <FlexRow className="justifyItemsToFlexEnd">
              {iconLinks.map((iconLink) => (
                <FlexColumn key={iconLink.text}>
                  <Image
                    className={styles.headerIkon}
                    src={iconLink.icon}
                    onMouseDown={() => window.open(iconLink.url, '_blank')}
                    onKeyDown={() => window.open(iconLink.url, '_blank')}
                    alt={iconLink.text}
                    title={iconLink.text}
                    tabIndex="0"
                  />
                </FlexColumn>
              ))}
              <FlexColumn className={styles.navAnsatt}>
                <Image
                  className={styles.headerIkon}
                  src={navAnsattIkonUrl}
                  alt={intl.formatMessage({ id: 'Header.NavAnsatt' })}
                  title={intl.formatMessage({ id: 'Header.NavAnsatt' })}
                />
                <span>{navAnsattName}</span>
              </FlexColumn>
            </FlexRow>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <ErrorMessagePanel queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} showDetailedErrorMessages={showDetailedErrorMessages} />
    </RawIntlProvider>
  </header>
);

Header.propTypes = {
  iconLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  systemTittel: PropTypes.string.isRequired,
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  showDetailedErrorMessages: PropTypes.bool.isRequired,
};

export default Header;
