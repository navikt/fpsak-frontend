import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Systemtittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';

import { getValueFromLocalStorage, setValueInLocalStorage, removeValueFromLocalStorage } from 'utils/localStorageHelper';
import Image from 'sharedComponents/Image';
import { Avdeling } from 'app/avdelingTsType';
import avdelingPropType from 'app/avdelingPropType';

import logoUrl from 'images/nav.svg';
import navAnsattIkonUrl from 'images/nav_ansatt.svg';
import rettskildeneIkonUrl from 'images/rettskildene.svg';
import systemrutineIkonUrl from 'images/rutine.svg';
import { RETTSKILDE_URL, SYSTEMRUTINE_URL } from 'data/eksterneLenker';

import ErrorMessagePanel from './ErrorMessagePanel';

import styles from './header.less';

type TsProps = Readonly<{
  navAnsattName: string;
  removeErrorMessage: () => void;
  queryStrings: {
    errormessage?: string;
    errorcode?: string;
  };
  avdelinger: Avdeling[];
  setValgtAvdeling: (id: string) => void;
  valgtAvdelingEnhet?: string;
}>

/**
 * Header
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet og NAV-ansatt navn.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
class Header extends Component<TsProps> {
  static propTypes = {
    queryStrings: PropTypes.shape({
      errormessage: PropTypes.string,
      errorcode: PropTypes.string,
    }).isRequired,
    navAnsattName: PropTypes.string.isRequired,
    removeErrorMessage: PropTypes.func.isRequired,
    avdelinger: PropTypes.arrayOf(avdelingPropType),
    setValgtAvdeling: PropTypes.func.isRequired,
    valgtAvdelingEnhet: PropTypes.string,
  };

  static defaultProps = {
    avdelinger: [],
    valgtAvdelingEnhet: undefined,
  };

  setAvdeling = () => {
    const {
      avdelinger,
      setValgtAvdeling,
      valgtAvdelingEnhet,
    } = this.props;

    if (avdelinger.length > 0 && !valgtAvdelingEnhet) {
      let valgtEnhet = avdelinger[0].avdelingEnhet;
      const lagretAvdelingEnhet = getValueFromLocalStorage('avdelingEnhet');
      if (lagretAvdelingEnhet) {
        if (avdelinger.some(a => a.avdelingEnhet === lagretAvdelingEnhet)) {
          valgtEnhet = lagretAvdelingEnhet;
        } else {
          removeValueFromLocalStorage('avdelingEnhet');
        }
      }
      setValgtAvdeling(valgtEnhet);
    }
  }

  componentDidMount = () => {
    this.setAvdeling();
  }

  componentDidUpdate = () => {
    this.setAvdeling();
  }

  setValgtAvdeling = (avdelingEnhet: string) => {
    const {
      setValgtAvdeling,
    } = this.props;
    setValueInLocalStorage('avdelingEnhet', avdelingEnhet);
    setValgtAvdeling(avdelingEnhet);
  }

  render = () => {
    const {
      navAnsattName,
      removeErrorMessage,
      queryStrings,
      avdelinger,
      valgtAvdelingEnhet,
    } = this.props;

    return (
      <header className={styles.container}>
        <div className={styles.topplinje}>
          <div>
            <div className={styles.logo}>
              <Image
                className={styles.headerIkon}
                src={logoUrl}
                altCode="Header.LinkToMainPage"
                titleCode="Header.LinkToMainPage"
              />
            </div>
            <div className={styles.headerDivider} />
          </div>
          <Systemtittel className={styles.text}><FormattedMessage id="Header.Foreldrepenger" /></Systemtittel>
          <div className={styles.navAnsatt}>
            {avdelinger.length > 0 && (
            <div className={styles.avdelingDropdownContainer}>
              <select className={styles.avdelingDropdown} value={valgtAvdelingEnhet} onChange={event => this.setValgtAvdeling(event.target.value)}>
                {avdelinger.map(a => <option key={a.avdelingEnhet} value={a.avdelingEnhet}>{`${a.avdelingEnhet} ${a.navn}`}</option>)}
              </select>
            </div>
            )}
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
              onMouseDown={() => window.open(RETTSKILDE_URL, '_blank')}
              onKeyDown={() => window.open(RETTSKILDE_URL, '_blank')}
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
  }
}

export default Header;
