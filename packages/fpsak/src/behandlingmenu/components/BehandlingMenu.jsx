import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import rettighetPropType from 'navAnsatt/rettighetPropType';
import navAnsattPropType from 'navAnsatt/navAnsattPropType';
import Image from 'sharedComponents/Image';
import openImage from 'images/pil_opp.svg';
import closedImage from 'images/pil_ned.svg';

import ResumeBehandlingMenuItem from './resumeBehandling/ResumeBehandlingMenuItem';
import PauseBehandlingMenuItem from './pauseBehandling/PauseBehandlingMenuItem';
import ShelveBehandlingMenuItem from './shelveBehandling/ShelveBehandlingMenuItem';
import CreateNewBehandlingMenuItem from './createNewBehandling/CreateNewBehandlingMenuItem';
import ChangeBehandlendeEnhetMenuItem from './changeBehandlendeEnhet/ChangeBehandlendeEnhetMenuItem';
import OpenBehandlingForChangesMenuItem from './openBehandlingForChanges/OpenBehandlingForChangesMenuItem';

import styles from './behandlingMenu.less';

const toggleEventListeners = (turnOnEventListeners, handleOutsideClick) => {
  if (turnOnEventListeners) {
    document.addEventListener('click', handleOutsideClick, false);
    document.addEventListener('mousedown', handleOutsideClick, false);
    document.addEventListener('keydown', handleOutsideClick, false);
  } else {
    document.removeEventListener('click', handleOutsideClick, false);
    document.removeEventListener('mousedown', handleOutsideClick, false);
    document.removeEventListener('keydown', handleOutsideClick, false);
  }
};

const getMenuButtonStyle = menuVisible => (menuVisible ? styles.containerHeadingOpen : styles.containerHeading);
const getMenuButtonText = menuVisible => (menuVisible ? 'Behandlingsmeny.Close' : 'Behandlingsmeny.Open');
const getImage = menuVisible => (menuVisible ? openImage : closedImage);
const getMenuStyle = menuVisible => (menuVisible ? styles.containerMenu : styles.hide);

/**
 * BehandlingMenu
 *
 * Presentasjonskomponent. Viser Behandlingsmeny.
 */
export class BehandlingMenu extends Component {
  constructor() {
    super();

    this.toggleBehandlingMenu = this.toggleBehandlingMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.hasNotAccess = this.hasNotAccess.bind(this);
    this.hasNotAccessOrKanVeilede = this.hasNotAccessOrKanVeilede.bind(this);
    this.isBehandlingOnHold = this.isBehandlingOnHold.bind(this);
    this.isBehandlingQueued = this.isBehandlingQueued.bind(this);
    this.hasEnabledNewBehandling = this.hasEnabledNewBehandling.bind(this);
    this.isResumeBehandlingEnabled = this.isResumeBehandlingEnabled.bind(this);
    this.isPauseBehandlingEnabled = this.isPauseBehandlingEnabled.bind(this);
    this.isShelveBehandlingEnebled = this.isShelveBehandlingEnebled.bind(this);
    this.isChangeBehandlendeEnhetEnabled = this.isChangeBehandlendeEnhetEnabled.bind(this);
    this.hasEnabledOpenBehandlingForChangesAccess = this.hasEnabledOpenBehandlingForChangesAccess.bind(this);

    this.state = {
      menuVisible: false,
    };
  }

  componentWillUnmount() {
    toggleEventListeners(false, this.handleOutsideClick);
  }

  toggleBehandlingMenu() {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  handleClick() {
    const { menuVisible } = this.state;
    toggleEventListeners(!menuVisible, this.handleOutsideClick);

    this.setState(prevState => ({
      menuVisible: !prevState.menuVisible,
    }));
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  }

  hasNotAccess() {
    const {
      gjenopptaBehandlingAccess, opprettNyForstegangsBehandlingAccess, opprettRevurderingAccess,
      byttBehandlendeEnhetAccess, settBehandlingPaVentAccess, henleggBehandlingAccess,
    } = this.props;
    return !settBehandlingPaVentAccess.employeeHasAccess
      && !henleggBehandlingAccess.employeeHasAccess
      && !byttBehandlendeEnhetAccess.employeeHasAccess
      && !opprettRevurderingAccess.employeeHasAccess
      && !opprettNyForstegangsBehandlingAccess.employeeHasAccess
      && !gjenopptaBehandlingAccess.employeeHasAccess;
  }

  hasNotAccessOrKanVeilede() {
    const { navAnsatt } = this.props;
    return this.hasNotAccess() || navAnsatt.kanVeilede;
  }

  isBehandlingOnHold() {
    const { behandlingIdentifier, behandlingPaaVent } = this.props;
    return behandlingIdentifier ? behandlingPaaVent : false;
  }

  isBehandlingQueued() {
    const { behandlingIdentifier, behandlingKoet } = this.props;
    return behandlingIdentifier ? behandlingKoet : false;
  }

  hasEnabledNewBehandling() {
    const { opprettNyForstegangsBehandlingAccess } = this.props;
    return opprettNyForstegangsBehandlingAccess.employeeHasAccess && opprettNyForstegangsBehandlingAccess.isEnabled;
  }

  hasEnabledNewRevurdering() {
    const { opprettRevurderingAccess } = this.props;
    return opprettRevurderingAccess.employeeHasAccess && opprettRevurderingAccess.isEnabled;
  }

  isResumeBehandlingEnabled() {
    const { isInnsynsbehandling, gjenopptaBehandlingAccess } = this.props;
    if (this.isBehandlingQueued() || !gjenopptaBehandlingAccess.employeeHasAccess) {
      return false;
    }
    return (isInnsynsbehandling && this.isBehandlingOnHold()) || (this.isBehandlingOnHold());
  }

  isPauseBehandlingEnabled() {
    const { settBehandlingPaVentAccess } = this.props;
    return !this.isBehandlingOnHold() && !this.isBehandlingQueued() && settBehandlingPaVentAccess.employeeHasAccess;
  }

  isShelveBehandlingEnebled() {
    const { henleggBehandlingAccess, isInnsynsbehandling, hasSoknad } = this.props;
    if (!henleggBehandlingAccess.employeeHasAccess) {
      return false;
    }
    if (!this.isBehandlingOnHold()) {
      return true;
    }
    return (!isInnsynsbehandling && !hasSoknad) || this.isBehandlingQueued();
  }

  isChangeBehandlendeEnhetEnabled() {
    const { behandlendeEnheter, byttBehandlendeEnhetAccess } = this.props;
    return behandlendeEnheter && !this.isBehandlingQueued() && byttBehandlendeEnhetAccess.employeeHasAccess;
  }

  hasEnabledOpenBehandlingForChangesAccess() {
    const { opneBehandlingForEndringerAccess } = this.props;
    return opneBehandlingForEndringerAccess.employeeHasAccess && opneBehandlingForEndringerAccess.isEnabled && !this.isBehandlingQueued();
  }

  render() {
    if (this.hasNotAccessOrKanVeilede()) {
      return null;
    }
    const {
      behandlingIdentifier, behandlendeEnheter, settBehandlingPaVentAccess, setBehandlingOnHold,
      gjenopptaBehandlingAccess, openBehandlingForChanges, previewHenleggBehandling, resumeBehandling, selectedBehandlingVersjon,
      shelveBehandling, push, henleggBehandlingAccess, behandlendeEnhetId, behandlendeEnhetNavn, nyBehandlendeEnhet,
      byttBehandlendeEnhetAccess, saksnummer, createNewForstegangsbehandling, ikkeVisOpprettNyBehandling,
    } = this.props;
    const { menuVisible } = this.state;

    return (
      <div className={styles.container} ref={(node) => { this.node = node; }}>
        <Knapp className={getMenuButtonStyle(menuVisible)} onClick={this.handleClick} tabIndex="0">
          <FormattedMessage id="Behandlingsmeny.Behandlingsmeny" />
          <FormattedMessage id={getMenuButtonText(menuVisible)}>
            {altText => (
              <Image
                className={styles.image}
                src={getImage(menuVisible)}
                alt={altText}
              />
            )
            }
          </FormattedMessage>
        </Knapp>
        <div className={getMenuStyle(menuVisible)}>
          <div className={styles.containerMenuRelative}>
            {this.isResumeBehandlingEnabled()
            && (
            <ResumeBehandlingMenuItem
              toggleBehandlingsmeny={this.toggleBehandlingMenu}
              behandlingIdentifier={behandlingIdentifier}
              behandlingVersjon={selectedBehandlingVersjon}
              resumeBehandling={resumeBehandling}
              gjenopptaBehandlingEnabled={gjenopptaBehandlingAccess.isEnabled}
            />
            )
            }
            {this.isPauseBehandlingEnabled()
            && (
            <PauseBehandlingMenuItem
              behandlingIdentifier={behandlingIdentifier}
              behandlingVersjon={selectedBehandlingVersjon}
              toggleBehandlingsmeny={this.toggleBehandlingMenu}
              setBehandlingOnHold={setBehandlingOnHold}
              settBehandlingPaVentEnabled={settBehandlingPaVentAccess.isEnabled}
            />
            )
            }
            {this.isShelveBehandlingEnebled()
            && (
            <ShelveBehandlingMenuItem
              toggleBehandlingsmeny={this.toggleBehandlingMenu}
              behandlingIdentifier={behandlingIdentifier}
              behandlingVersjon={selectedBehandlingVersjon}
              previewHenleggBehandling={previewHenleggBehandling}
              shelveBehandling={shelveBehandling}
              push={push}
              henleggBehandlingEnabled={henleggBehandlingAccess.isEnabled}
            />
            )
            }
            {this.hasEnabledOpenBehandlingForChangesAccess()
              && (
              <OpenBehandlingForChangesMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                behandlingIdentifier={behandlingIdentifier}
                openBehandlingForChanges={openBehandlingForChanges}
                behandlingVersjon={selectedBehandlingVersjon}
              />
              )
            }
            {this.isChangeBehandlendeEnhetEnabled()
            && (
            <ChangeBehandlendeEnhetMenuItem
              toggleBehandlingsmeny={this.toggleBehandlingMenu}
              behandlendeEnheter={behandlendeEnheter}
              behandlingIdentifier={behandlingIdentifier}
              behandlingVersjon={selectedBehandlingVersjon}
              behandlendeEnhetId={behandlendeEnhetId}
              behandlendeEnhetNavn={behandlendeEnhetNavn}
              nyBehandlendeEnhet={nyBehandlendeEnhet}
              byttBehandlendeEnhetEnabled={byttBehandlendeEnhetAccess.isEnabled}
            />
            )
            }
            {!this.isBehandlingQueued()
            && (
            <CreateNewBehandlingMenuItem
              saksnummer={saksnummer}
              push={push}
              submitNyForstegangsBehandling={createNewForstegangsbehandling}
              opprettNyForstegangsBehandlingEnabled={this.hasEnabledNewBehandling()}
              opprettRevurderingEnabled={this.hasEnabledNewRevurdering()}
              ikkeVisOpprettNyBehandling={ikkeVisOpprettNyBehandling.isEnabled}
            />
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

BehandlingMenu.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  selectedBehandlingVersjon: PropTypes.number,
  behandlendeEnhetId: PropTypes.string,
  behandlendeEnhetNavn: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  behandlingKoet: PropTypes.bool,
  previewHenleggBehandling: PropTypes.func.isRequired,
  resumeBehandling: PropTypes.func.isRequired,
  shelveBehandling: PropTypes.func.isRequired,
  nyBehandlendeEnhet: PropTypes.func.isRequired,
  createNewForstegangsbehandling: PropTypes.func.isRequired,
  behandlendeEnheter: PropTypes.arrayOf(PropTypes.shape({
    enhetId: PropTypes.string.isRequired,
    enhetNavn: PropTypes.string.isRequired,
  })),
  setBehandlingOnHold: PropTypes.func.isRequired,
  openBehandlingForChanges: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  henleggBehandlingAccess: rettighetPropType.isRequired,
  settBehandlingPaVentAccess: rettighetPropType.isRequired,
  byttBehandlendeEnhetAccess: rettighetPropType.isRequired,
  opprettRevurderingAccess: rettighetPropType.isRequired,
  opprettNyForstegangsBehandlingAccess: rettighetPropType.isRequired,
  gjenopptaBehandlingAccess: rettighetPropType.isRequired,
  opneBehandlingForEndringerAccess: rettighetPropType.isRequired,
  ikkeVisOpprettNyBehandling: rettighetPropType.isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  hasSoknad: PropTypes.bool.isRequired,
  isInnsynsbehandling: PropTypes.bool.isRequired,
};

BehandlingMenu.defaultProps = {
  behandlingIdentifier: undefined,
  behandlendeEnhetId: undefined,
  behandlendeEnhetNavn: undefined,
  selectedBehandlingVersjon: undefined,
  behandlingPaaVent: undefined,
  behandlingKoet: false,
  behandlendeEnheter: null,
};

export default BehandlingMenu;
