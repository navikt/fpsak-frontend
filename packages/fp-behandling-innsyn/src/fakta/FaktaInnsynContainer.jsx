import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getBehandlingVersjon } from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingInnsyn/src/duckInnsyn';
import { resetFakta, getOpenInfoPanels } from './duckFaktaInnsyn';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';

/**
 * FaktaAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const FaktaInnsynContainer = props => (
  <FaktaInnsynPanel {...props} />
);

FaktaInnsynContainer.propTypes = {
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

export default connect(mapStateToProps)(FaktaInnsynContainer);
