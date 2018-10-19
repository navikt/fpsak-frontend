import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import Image from 'sharedComponents/Image';

import logoUrl from 'images/nav.svg';
import navAnsattIkonUrl from 'images/nav_ansatt.svg';
import rettskildeneIkonUrl from 'images/rettskildene.svg';
import systemrutineIkonUrl from 'images/rutine.svg';

import ErrorMessagePanel from './ErrorMessagePanel';

import styles from './header.less';

/**
 * Header
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet, NAV-ansatt navn og lenke til rettskildene og systemrutinen.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const Header = ({
  navAnsattName,
  removeErrorMessage,
  rettskildeUrl,
  systemrutineUrl,
  queryStrings,
}) => (
  <header className={styles.container}>
    <div className={styles.topplinje}>
      <div>
        <div className={styles.logo}>
          <Link to="/">
            <Image
              className={styles.headerIkon}
              src={logoUrl}
              altCode="Header.LinkToMainPage"
              titleCode="Header.LinkToMainPage"
            />
          </Link>
        </div>
        <div className={styles.headerDivider} />
      </div>
      <Systemtittel className={styles.text}><FormattedMessage id="Header.Foreldrepenger" /></Systemtittel>
      <div className={styles.navAnsatt}>
        <Image
          className={styles.weightIkon}
          src={systemrutineIkonUrl}
          onMouseDown={() => window.open(systemrutineUrl, '_blank')}
          onKeyDown={() => window.open(systemrutineUrl, '_blank')}
          altCode="Header.Systemrutine"
          titleCode="Header.Systemrutine"
          tabIndex="0"
        />
        <Image
          className={styles.weightIkon}
          src={rettskildeneIkonUrl}
          onMouseDown={() => window.open(rettskildeUrl, '_blank')}
          onKeyDown={() => window.open(rettskildeUrl, '_blank')}
          altCode="Header.Rettskilde"
          titleCode="Header.Rettskilde"
          tabIndex="0"
        />
        <div className={styles.weightAndUserDivider} />
        <Image
          className={styles.navAnsattIkon}
          src={navAnsattIkonUrl}
          altCode="Header.NavAnsatt"
          titleCode="Header.NavAnsatt"
        />
        <div className={styles.navAnsattTekst}>{navAnsattName}</div>
      </div>
    </div>
    <ErrorMessagePanel queryStrings={queryStrings} removeErrorMessage={removeErrorMessage} />
  </header>
);

Header.propTypes = {
  queryStrings: PropTypes.shape().isRequired,
  navAnsattName: PropTypes.string.isRequired,
  rettskildeUrl: PropTypes.string.isRequired,
  systemrutineUrl: PropTypes.string.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
};

export default Header;
