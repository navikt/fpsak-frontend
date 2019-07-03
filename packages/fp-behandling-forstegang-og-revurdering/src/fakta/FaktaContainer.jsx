import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  resetFakta, resolveFaktaAksjonspunkter, resolveFaktaOverstyrAksjonspunkter, getOpenInfoPanels,
} from './duck';
import FaktaPanel from './components/FaktaPanel';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_FAKTA_UTTAK, ac.OVERSTYR_AVKLAR_STARTDATO, ac.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK, ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

/**
 * FaktaContainer
 *
 * Har ansvar for faktadelen av hovedvinduet.
 */
export const FaktaContainer = ({
  faktaIndexProps,
}) => (
  <FaktaPanel faktaIndexProps={faktaIndexProps} overstyringApCodes={overstyringApCodes} />
);

FaktaContainer.propTypes = {
  faktaIndexProps: PropTypes.instanceOf(FaktaIndexProps).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  faktaIndexProps: new FaktaIndexProps(
    getBehandlingIdentifier(state),
    getBehandlingVersjon(state),
    getOpenInfoPanels(state),
    ownProps.shouldOpenDefaultInfoPanels,
    resetFakta,
    resolveFaktaAksjonspunkter,
    resolveFaktaOverstyrAksjonspunkter,
  ),
});

export default connect(mapStateToProps)(FaktaContainer);
