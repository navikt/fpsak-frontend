import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingKlage/src/duckBehandlingKlage';
import behandlingSelectors from '../selectors/klageBehandlingSelectors';
import {
  fetchPreviewKlageBrev,
  getResolveProsessAksjonspunkterSuccess,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  resolveProsessAksjonspunkter,
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
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  overrideProsessAksjonspunkter: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
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
  behandlingspunkterStatus: behandlingsprosessKlageSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingsprosessKlageSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingsprosessKlageSelectors.getAksjonspunkterOpenStatus(state),
  fetchPreviewBrev: fetchPreviewKlageBrev,
  location: state.router.location,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessKlageContainer);
