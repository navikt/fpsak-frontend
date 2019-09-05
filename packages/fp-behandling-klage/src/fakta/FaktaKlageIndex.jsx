import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex, parseFaktaParam, paramsAreEqual } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingKlage/src/duckBehandlingKlage';
import { getOpenInfoPanels, resetFakta, setOpenInfoPanels } from './duckFaktaKlage';
import FaktaKlagePanel from './components/FaktaKlagePanel';

/**
 * FaktaKlageIndex
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er klage.
 */
export const FaktaKlageIndex = ({
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
    render={() => <FaktaKlagePanel />}
  />
);

FaktaKlageIndex.propTypes = {
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
})(connect(mapStateToProps)(FaktaKlageIndex));

export default TrackRouteParamFaktaIndex;
