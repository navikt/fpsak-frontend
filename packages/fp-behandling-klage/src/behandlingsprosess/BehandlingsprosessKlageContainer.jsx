import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingKlage/src/duckBehandlingKlage';
import behandlingSelectors from '../selectors/klageBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, overrideProsessAksjonspunkter, resetBehandlingspunkter, getResolveProsessAksjonspunkterSuccess, fetchPreviewKlageBrev,
} from './duckBpKlage';
import behandlingsprosessKlageSelectors from './selectors/behandlingsprosessKlageSelectors';
import BehandlingsprosessKlageIndex from './BehandlingsprosessKlageIndex';

/**
 * BehandlingsprosessKlageContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Klage.
 */
export const BehandlingsprosessKlageContainer = (props) => (
  <BehandlingsprosessKlageIndex {...props} />
);

BehandlingsprosessKlageContainer.propTypes = {
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
  overrideProsessAksjonspunkter: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

const mapStateToProps = (state) => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingsprosessKlageSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingsprosessKlageSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  getBehandlingspunkterStatus: behandlingsprosessKlageSelectors.getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes: behandlingsprosessKlageSelectors.getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus: behandlingsprosessKlageSelectors.getAksjonspunkterOpenStatus,
  fetchPreviewBrev: fetchPreviewKlageBrev,
  location: state.router.location,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessKlageContainer);
