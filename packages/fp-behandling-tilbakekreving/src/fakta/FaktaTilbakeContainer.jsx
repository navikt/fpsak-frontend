import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import {
  resetFakta, resolveFaktaAksjonspunkter, getOpenInfoPanels,
} from './duckFaktaTilbake';
import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';

/**
 * FaktaTilbakeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet for Tilbakekreving.
 */
export const FaktaTilbakeContainer = props => (
  <TilbakekrevingFaktaPanel {...props} />
);

FaktaTilbakeContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetFakta: PropTypes.func.isRequired,
  resolveFaktaAksjonspunkter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
  resetFakta,
  resolveFaktaAksjonspunkter,
});

export default connect(mapStateToProps)(FaktaTilbakeContainer);
