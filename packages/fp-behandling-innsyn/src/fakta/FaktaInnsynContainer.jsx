import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import behandlingSelectors from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingInnsyn/src/duckBehandlingInnsyn';
import { getOpenInfoPanels, resetFakta } from './duckFaktaInnsyn';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';

/**
 * FaktaInnsynContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const FaktaInnsynContainer = (props) => (
  <FaktaInnsynPanel {...props} />
);

FaktaInnsynContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  resetFakta: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
  resetFakta,
});

export default connect(mapStateToProps)(FaktaInnsynContainer);
