import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingsprosessIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingAnke/src/duckAnke';
import {
  getBehandlingVersjon, getBehandlingStatus, getBehandlingsresultat, getBehandlingHenlagt,
} from '../selectors/ankeBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, resetBehandlingspunkter, fetchPreviewAnkeBrev, getResolveProsessAksjonspunkterSuccess,
} from './duckBpAnke';
import behandlingspunktAnkeSelectors from './selectors/BehandlingsprosessAnkeSelectors';
import BehandlingsprosessAnkeIndex from './BehandlingsprosessAnkeIndex';

/**
 * BehandlingsprosessAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Anke.
 */
export const BehandlingsprosessAnkeContainer = ({
  behandlingsprosessIndexProps,
}) => (
  <BehandlingsprosessAnkeIndex behandlingsprosessIndexProps={behandlingsprosessIndexProps} />
);

BehandlingsprosessAnkeContainer.propTypes = {
  behandlingsprosessIndexProps: PropTypes.instanceOf(BehandlingsprosessIndexProps).isRequired,
};

const mapStateToProps = state => ({
  behandlingsprosessIndexProps: new BehandlingsprosessIndexProps(
    getFagsakYtelseType(state),
    getBehandlingHenlagt(state),
    getBehandlingIdentifier(state),
    getBehandlingVersjon(state),
    behandlingspunktAnkeSelectors.getBehandlingspunkter(state),
    behandlingspunktAnkeSelectors.getDefaultBehandlingspunkt(state),
    behandlingspunktAnkeSelectors.getSelectedBehandlingspunkt(state),
    getResolveProsessAksjonspunkterSuccess(state),
    getBehandlingStatus(state),
    getBehandlingsresultat(state),
    behandlingspunktAnkeSelectors.getBehandlingspunkterStatus,
    behandlingspunktAnkeSelectors.getBehandlingspunkterTitleCodes,
    behandlingspunktAnkeSelectors.getAksjonspunkterOpenStatus,
    fetchPreviewAnkeBrev,
    resolveProsessAksjonspunkter,
    resetBehandlingspunkter,
  ),
});

export default connect(mapStateToProps)(BehandlingsprosessAnkeContainer);
