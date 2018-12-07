import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import Image from 'sharedComponents/Image';

import logoUrl from '@fpsak-frontend/assets/images/nav.svg';
import navAnsattIkonUrl from '@fpsak-frontend/assets/images/nav_ansatt.svg';
import rettskildeneIkonUrl from '@fpsak-frontend/assets/images/rettskildene.svg';
import systemrutineIkonUrl from '@fpsak-frontend/assets/images/rutine.svg';

import ErrorMessagePanel from './ErrorMessagePanel';

import styles from './header.less';

/* eslint-disable max-len */
const SYSTEMRUTINE_URL = 'https://navet.adeo.no/ansatt/Fag/Familie/Svangerskap%2C+fodsel%2C+adopsjon/Saksbehandlingsl%C3%B8sning+for+engangsst%C3%B8nad+og+foreldrepenger/rutiner-saksbehandlingsl%C3%B8sningen-for-foreldrepenger';

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
          onMouseDown={() => window.open(SYSTEMRUTINE_URL, '_blank')}
          onKeyDown={() => window.open(SYSTEMRUTINE_URL, '_blank')}
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
  removeErrorMessage: PropTypes.func.isRequired,
};

export default Header;
