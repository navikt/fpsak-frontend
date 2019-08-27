import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import behandlingSelectors from '../selectors/tilbakekrevingBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, resetBehandlingspunkter, getResolveProsessAksjonspunkterSuccess,
} from './duckBpTilbake';
import behandlingspunktTilbakekrevingSelectors from './selectors/behandlingsprosessTilbakeSelectors';
import BehandlingsprosessTilbakekrevingIndex from './BehandlingsprosessTilbakekrevingIndex';

/**
 * BehandlingsprosessTilbakekrevingContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Tilbakekreving.
 */
export const BehandlingsprosessTilbakekrevingContainer = (props) => (
  <BehandlingsprosessTilbakekrevingIndex {...props} doNotUseFatterVedtakModal />
);

BehandlingsprosessTilbakekrevingContainer.propTypes = {
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
  behandlingspunkter: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktTilbakekrevingSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  getBehandlingspunkterStatus: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus: behandlingspunktTilbakekrevingSelectors.getAksjonspunkterOpenStatus,
  location: state.router.location,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessTilbakekrevingContainer);
