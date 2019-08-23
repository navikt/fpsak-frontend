import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import behandlingSelectors from '../selectors/tilbakekrevingBehandlingSelectors';
import { getResolveProsessAksjonspunkterSuccess, resetBehandlingspunkter, resolveProsessAksjonspunkter } from './duckBpTilbake';
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
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingUuid: PropTypes.string.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  behandlingUuid: behandlingSelectors.getBehandlingUuid(state),
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
  behandlingspunkterStatus: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktTilbakekrevingSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktTilbakekrevingSelectors.getAksjonspunkterOpenStatus(state),
  location: state.router.location,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessTilbakekrevingContainer);
