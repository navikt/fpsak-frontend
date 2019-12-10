import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames/bind';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { Image } from '@fpsak-frontend/shared-components';
import openImage from '@fpsak-frontend/assets/images/pil_opp.svg';
import closedImage from '@fpsak-frontend/assets/images/pil_ned.svg';

import ResumeBehandlingMenuItem from './resumeBehandling/ResumeBehandlingMenuItem';
import PauseBehandlingMenuItem from './pauseBehandling/PauseBehandlingMenuItem';
import ShelveBehandlingMenuItem from './shelveBehandling/ShelveBehandlingMenuItem';
import CreateNewBehandlingMenuItem from './createNewBehandling/CreateNewBehandlingMenuItem';
import ChangeBehandlendeEnhetMenuItem from './changeBehandlendeEnhet/ChangeBehandlendeEnhetMenuItem';
import OpenBehandlingForChangesMenuItem from './openBehandlingForChanges/OpenBehandlingForChangesMenuItem';
import OpprettEllerFjernVergeMenuItem from './verge/OpprettEllerFjernVergeMenuItem';
import MenyKodeverk from '../MenyKodeverk';
import MenyBehandlingData from '../MenyBehandlingData';
import MenyRettigheter from '../MenyRettigheter';

import styles from './behandlingMenu.less';

const classNames = classnames.bind(styles);

const getMenuButtonText = (menuVisible) => (menuVisible ? 'Behandlingsmeny.Close' : 'Behandlingsmeny.Open');
const getImage = (menuVisible) => (menuVisible ? openImage : closedImage);

/**
 * BehandlingMenu
 *
 * Presentasjonskomponent. Viser Behandlingsmeny.
 */
class BehandlingMenu extends Component {
  constructor(props) {
    super(props);

    this.toggleBehandlingMenu = this.toggleBehandlingMenu.bind(this);
    this.hasNotAccess = this.hasNotAccess.bind(this);
    this.hasNotAccessOrKanVeilede = this.hasNotAccessOrKanVeilede.bind(this);
    this.isBehandlingOnHold = this.isBehandlingOnHold.bind(this);
    this.isBehandlingQueued = this.isBehandlingQueued.bind(this);
    this.hasEnabledNewBehandling = this.hasEnabledNewBehandling.bind(this);
    this.isResumeBehandlingEnabled = this.isResumeBehandlingEnabled.bind(this);
    this.isPauseBehandlingEnabled = this.isPauseBehandlingEnabled.bind(this);
    this.isShelveBehandlingEnebled = this.isShelveBehandlingEnebled.bind(this);
    this.resumeBehandling = this.resumeBehandling.bind(this);
    this.isChangeBehandlendeEnhetEnabled = this.isChangeBehandlendeEnhetEnabled.bind(this);
    this.hasEnabledOpenBehandlingForChangesAccess = this.hasEnabledOpenBehandlingForChangesAccess.bind(this);
    this.state = {
      menuVisible: false,
    };
  }

  toggleBehandlingMenu() {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  hideBehandlingsMenu() {
    this.setState({ menuVisible: false });
  }

  hasNotAccess() {
    const { rettigheter } = this.props;
    return !rettigheter.settBehandlingPaVentAccess.employeeHasAccess
      && !rettigheter.henleggBehandlingAccess.employeeHasAccess
      && !rettigheter.byttBehandlendeEnhetAccess.employeeHasAccess
      && !rettigheter.opprettRevurderingAccess.employeeHasAccess
      && !rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
      && !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess;
  }

  hasNotAccessOrKanVeilede() {
    const { navAnsatt } = this.props;
    return this.hasNotAccess() || navAnsatt.kanVeilede;
  }

  isBehandlingOnHold() {
    const { behandlingData } = this.props;
    return behandlingData.erPaVent;
  }

  isBehandlingQueued() {
    const { behandlingData } = this.props;
    return behandlingData.erKoet;
  }

  hasEnabledNewBehandling() {
    const { rettigheter } = this.props;
    return rettigheter.opprettNyForstegangsBehandlingAccess.employeeHasAccess
    && rettigheter.opprettNyForstegangsBehandlingAccess.isEnabled;
  }

  hasEnabledNewRevurdering() {
    const { rettigheter } = this.props;
    return rettigheter.opprettRevurderingAccess.employeeHasAccess && rettigheter.opprettRevurderingAccess.isEnabled;
  }

  isResumeBehandlingEnabled() {
    const { behandlingData, rettigheter } = this.props;
    if (!behandlingData.harValgtBehandling || this.isBehandlingQueued() || !rettigheter.gjenopptaBehandlingAccess.employeeHasAccess) {
      return false;
    }
    return (behandlingData.type.kode === BehandlingType.DOKUMENTINNSYN && this.isBehandlingOnHold()) || (this.isBehandlingOnHold());
  }

  isPauseBehandlingEnabled() {
    const { behandlingData, rettigheter } = this.props;
    return behandlingData.harValgtBehandling
      && !this.isBehandlingOnHold()
      && !this.isBehandlingQueued()
      && rettigheter.settBehandlingPaVentAccess.employeeHasAccess;
  }

  isShelveBehandlingEnebled() {
    const { behandlingData, rettigheter } = this.props;
    if (!behandlingData.harValgtBehandling || !rettigheter.henleggBehandlingAccess.employeeHasAccess) {
      return false;
    }
    return true;
  }

  isChangeBehandlendeEnhetEnabled() {
    const { behandlingData, behandlendeEnheter, rettigheter } = this.props;
    return behandlingData.harValgtBehandling
      && behandlendeEnheter
      && !this.isBehandlingQueued()
      && rettigheter.byttBehandlendeEnhetAccess.employeeHasAccess;
  }

  hasEnabledOpenBehandlingForChangesAccess() {
    const { behandlingData, rettigheter } = this.props;
    return behandlingData.harValgtBehandling
      && rettigheter.opneBehandlingForEndringerAccess.employeeHasAccess
      && rettigheter.opneBehandlingForEndringerAccess.isEnabled
      && !this.isBehandlingQueued();
  }

  resumeBehandling(behandlingIdentifier, params) {
    const { resumeBehandling } = this.props;
    return resumeBehandling(behandlingIdentifier, params);
  }

  render() {
    if (this.hasNotAccessOrKanVeilede()) {
      return null;
    }
    const {
      behandlingData, behandlendeEnheter, setBehandlingOnHold, rettigheter, openBehandlingForChanges,
      previewHenleggBehandling, shelveBehandling, push, nyBehandlendeEnhet, saksnummer, createNewBehandling,
      fjernVerge, opprettVerge, menyKodeverk, ytelseType, kanTilbakekrevingOpprettes,
      sjekkOmTilbakekrevingKanOpprettes, sjekkOmTilbakekrevingRevurderingKanOpprettes, uuidForSistLukkede, erTilbakekrevingAktivert,
    } = this.props;
    const { menuVisible } = this.state;
    const behandlingIdentifier = new BehandlingIdentifier(saksnummer, behandlingData.id);
    return (
      <div className={styles.container}>
        <Knapp
          className={classNames('containerHeading', { menuVisible })}
          onBlur={() => this.hideBehandlingsMenu()}
          onClick={() => this.toggleBehandlingMenu()}
          tabIndex="0"
          ref={this.behandlingsMenuRef}
        >
          <FormattedMessage id="Behandlingsmeny.Behandlingsmeny" />
          <FormattedMessage id={getMenuButtonText(menuVisible)}>
            {(altText) => (
              <Image
                className={styles.image}
                src={getImage(menuVisible)}
                alt={altText}
              />
            )}
          </FormattedMessage>
        </Knapp>
        <div className={classNames('containerMenu', { hide: !menuVisible })}>
          <div className={styles.containerMenuRelative}>
            {this.isResumeBehandlingEnabled() && (
              <ResumeBehandlingMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                behandlingIdentifier={behandlingIdentifier}
                behandlingVersjon={behandlingData.versjon}
                resumeBehandling={this.resumeBehandling}
                gjenopptaBehandlingEnabled={rettigheter.gjenopptaBehandlingAccess.isEnabled}
              />
            )}
            {this.isPauseBehandlingEnabled() && (
              <PauseBehandlingMenuItem
                behandlingIdentifier={behandlingIdentifier}
                behandlingVersjon={behandlingData.versjon}
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                setBehandlingOnHold={setBehandlingOnHold}
                settBehandlingPaVentEnabled={rettigheter.settBehandlingPaVentAccess.isEnabled}
                menyKodeverk={menyKodeverk}
              />
            )}
            {this.isShelveBehandlingEnebled() && (
              <ShelveBehandlingMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                behandlingIdentifier={behandlingIdentifier}
                behandlingVersjon={behandlingData.versjon}
                previewHenleggBehandling={previewHenleggBehandling}
                shelveBehandling={shelveBehandling}
                push={push}
                henleggBehandlingEnabled={rettigheter.henleggBehandlingAccess.isEnabled}
                ytelseType={ytelseType}
                behandlingType={behandlingData.type}
                behandlingUuid={behandlingData.uuid}
                menyKodeverk={menyKodeverk}
              />
            )}
            {this.hasEnabledOpenBehandlingForChangesAccess() && (
              <OpenBehandlingForChangesMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                behandlingIdentifier={behandlingIdentifier}
                openBehandlingForChanges={openBehandlingForChanges}
                behandlingVersjon={behandlingData.versjon}
              />
            )}
            {this.isChangeBehandlendeEnhetEnabled() && (
              <ChangeBehandlendeEnhetMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                behandlendeEnheter={behandlendeEnheter}
                behandlingIdentifier={behandlingIdentifier}
                behandlingVersjon={behandlingData.versjon}
                behandlendeEnhetId={behandlingData.behandlendeEnhetId}
                behandlendeEnhetNavn={behandlingData.behandlendeEnhetNavn}
                nyBehandlendeEnhet={nyBehandlendeEnhet}
                byttBehandlendeEnhetEnabled={rettigheter.byttBehandlendeEnhetAccess.isEnabled}
              />
            )}
            {!this.isBehandlingQueued() && (
              <CreateNewBehandlingMenuItem
                toggleBehandlingsmeny={this.toggleBehandlingMenu}
                saksnummer={saksnummer}
                behandlingIdentifier={behandlingIdentifier}
                behandlingType={behandlingData.type}
                push={push}
                submitNyBehandling={createNewBehandling}
                opprettNyForstegangsBehandlingEnabled={this.hasEnabledNewBehandling()}
                opprettRevurderingEnabled={this.hasEnabledNewRevurdering()}
                ikkeVisOpprettNyBehandling={rettigheter.ikkeVisOpprettNyBehandling.isEnabled}
                menyKodeverk={menyKodeverk}
                kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
                sjekkOmTilbakekrevingKanOpprettes={sjekkOmTilbakekrevingKanOpprettes}
                sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkOmTilbakekrevingRevurderingKanOpprettes}
                uuidForSistLukkede={uuidForSistLukkede}
                erTilbakekrevingAktivert={erTilbakekrevingAktivert}
                ytelseType={ytelseType}
              />
            )}
            {(opprettVerge || fjernVerge) && (
              <OpprettEllerFjernVergeMenuItem
                fjernVerge={fjernVerge}
                opprettVerge={opprettVerge}
                behandlingIdentifier={behandlingIdentifier}
                behandlingVersjon={behandlingData.versjon}
                push={push}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

BehandlingMenu.propTypes = {
  saksnummer: PropTypes.string.isRequired,
  behandlingData: PropTypes.instanceOf(MenyBehandlingData),
  menyKodeverk: PropTypes.instanceOf(MenyKodeverk),
  ytelseType: kodeverkObjektPropType.isRequired,
  previewHenleggBehandling: PropTypes.func.isRequired,
  rettigheter: PropTypes.instanceOf(MenyRettigheter),
  uuidForSistLukkede: PropTypes.string,
  resumeBehandling: PropTypes.func.isRequired,
  shelveBehandling: PropTypes.func.isRequired,
  nyBehandlendeEnhet: PropTypes.func.isRequired,
  createNewBehandling: PropTypes.func.isRequired,
  behandlendeEnheter: PropTypes.arrayOf(PropTypes.shape({
    enhetId: PropTypes.string.isRequired,
    enhetNavn: PropTypes.string.isRequired,
  })),
  erTilbakekrevingAktivert: PropTypes.bool.isRequired,
  kanTilbakekrevingOpprettes: PropTypes.shape({
    kanBehandlingOpprettes: PropTypes.bool.isRequired,
    kanRevurderingOpprettes: PropTypes.bool.isRequired,
  }),
  setBehandlingOnHold: PropTypes.func.isRequired,
  openBehandlingForChanges: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingKanOpprettes: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingRevurderingKanOpprettes: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  fjernVerge: PropTypes.func,
  opprettVerge: PropTypes.func,
};

BehandlingMenu.defaultProps = {
  behandlendeEnheter: null,
  fjernVerge: undefined,
  opprettVerge: undefined,
  kanTilbakekrevingOpprettes: undefined,
};

export default BehandlingMenu;
