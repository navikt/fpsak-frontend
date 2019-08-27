import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingInnsyn/src/duckBehandlingInnsyn';
import behandlingSelectors from '../selectors/innsynBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, resetBehandlingspunkter, getResolveProsessAksjonspunkterSuccess, fetchPreviewBrev as fetchPreview,
} from './duckBpInnsyn';
import behandlingspunktInnsynSelectors from './selectors/behandlingsprosessInnsynSelectors';
import BehandlingsprosessInnsynIndex from './BehandlingsprosessInnsynIndex';

/**
 * BehandlingsprosessInnsynContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const BehandlingsprosessInnsynContainer = (props) => (
  <BehandlingsprosessInnsynIndex {...props} />
);

BehandlingsprosessInnsynContainer.propTypes = {
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
  getBehandlingspunkterStatus: PropTypes.func.isRequired,
  getBehandlingspunkterTitleCodes: PropTypes.func.isRequired,
  getAksjonspunkterOpenStatus: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

const mapStateToProps = (state) => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktInnsynSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktInnsynSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  getBehandlingspunkterStatus: behandlingspunktInnsynSelectors.getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes: behandlingspunktInnsynSelectors.getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus: behandlingspunktInnsynSelectors.getAksjonspunkterOpenStatus,
  fetchPreviewBrev: fetchPreview,
  location: state.router.location,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessInnsynContainer);
