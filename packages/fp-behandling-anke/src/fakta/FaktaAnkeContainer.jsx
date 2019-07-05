import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getBehandlingVersjon } from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingAnke/src/duckAnke';
import { getOpenInfoPanels, resetFakta } from './duckFaktaAnke';
import FaktaAnkePanel from './components/FaktaAnkePanel';

/**
 * FaktaAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Anke.
 */
export const FaktaAnkeContainer = props => (
  <FaktaAnkePanel {...props} />
);

FaktaAnkeContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetFakta: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
  resetFakta,
});

export default connect(mapStateToProps)(FaktaAnkeContainer);
