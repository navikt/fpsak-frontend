import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import {
  getOpenInfoPanels, resetFakta, resolveFaktaAksjonspunkter, resolveFaktaOverstyrAksjonspunkter,
} from './duckFaktaForstegangOgRev';
import FaktaPanel from './components/FaktaPanel';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_FAKTA_UTTAK, ac.OVERSTYR_AVKLAR_STARTDATO, ac.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK, ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

/**
 * FaktaContainer
 *
 * Har ansvar for faktadelen av hovedvinduet.
 */
export const FaktaContainer = (props) => (
  <FaktaPanel {...props} overstyringApCodes={overstyringApCodes} />
);

FaktaContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetFakta: PropTypes.func.isRequired,
  resolveFaktaAksjonspunkter: PropTypes.func.isRequired,
  resolveFaktaOverstyrAksjonspunkter: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
  resetFakta,
  resolveFaktaAksjonspunkter,
  resolveFaktaOverstyrAksjonspunkter,
});

export default connect(mapStateToProps)(FaktaContainer);
