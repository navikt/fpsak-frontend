import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import behandlingSelectors from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingKlage/src/duckBehandlingKlage';
import { getOpenInfoPanels, resetFakta } from './duckFaktaKlage';
import FaktaKlagePanel from './components/FaktaKlagePanel';

/**
 * FaktaKlageContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er klage.
 */
export const FaktaKlageContainer = (props) => (
  <FaktaKlagePanel {...props} />
);

FaktaKlageContainer.propTypes = {
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

export default connect(mapStateToProps)(FaktaKlageContainer);