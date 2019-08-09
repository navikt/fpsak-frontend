import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingAnke/src/duckBehandlingAnke';
import behandlingSelectors from '../selectors/ankeBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, resetBehandlingspunkter, fetchPreviewAnkeBrev, getResolveProsessAksjonspunkterSuccess,
} from './duckBpAnke';
import behandlingspunktAnkeSelectors from './selectors/behandlingsprosessAnkeSelectors';
import BehandlingsprosessAnkeIndex from './BehandlingsprosessAnkeIndex';

/**
 * BehandlingsprosessAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Anke.
 */
export const BehandlingsprosessAnkeContainer = props => (
  <BehandlingsprosessAnkeIndex {...props} />
);

BehandlingsprosessAnkeContainer.propTypes = {
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
};

const mapStateToProps = state => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktAnkeSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktAnkeSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  getBehandlingspunkterStatus: behandlingspunktAnkeSelectors.getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes: behandlingspunktAnkeSelectors.getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus: behandlingspunktAnkeSelectors.getAksjonspunkterOpenStatus,
  location: state.router.location,
  fetchPreviewBrev: fetchPreviewAnkeBrev,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessAnkeContainer);
