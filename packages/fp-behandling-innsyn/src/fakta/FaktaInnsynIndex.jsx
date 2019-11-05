import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex, parseFaktaParam, paramsAreEqual } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingIdentifier } from '../duckBehandlingInnsyn';
import behandlingSelectors from '../selectors/innsynBehandlingSelectors';
import { getOpenInfoPanels, resetFakta, setOpenInfoPanels } from './duckFaktaInnsyn';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';

/**
 * FaktaInnsynContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const FaktaInnsynIndex = ({
  location,
  behandlingIdentifier,
  behandlingVersjon,
  openInfoPanels,
}) => (
  <CommonFaktaIndex
    location={location}
    behandlingIdentifier={behandlingIdentifier}
    behandlingVersjon={behandlingVersjon}
    openInfoPanels={openInfoPanels}
    resetFakta={resetFakta}
    render={() => <FaktaInnsynPanel />}
  />
);

FaktaInnsynIndex.propTypes = {
  location: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
});

const TrackRouteParamFaktaIndex = trackRouteParam({
  paramName: 'fakta',
  parse: parseFaktaParam,
  paramPropType: PropTypes.arrayOf(PropTypes.string),
  storeParam: setOpenInfoPanels,
  getParamFromStore: getOpenInfoPanels,
  isQueryParam: true,
  paramsAreEqual,
})(connect(mapStateToProps)(FaktaInnsynIndex));

export default TrackRouteParamFaktaIndex;
