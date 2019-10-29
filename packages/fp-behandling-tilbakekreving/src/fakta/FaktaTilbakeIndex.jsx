import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex, parseFaktaParam, paramsAreEqual } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from '../selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from '../duckBehandlingTilbakekreving';
import {
  getOpenInfoPanels, resetFakta, resolveFaktaAksjonspunkter, setOpenInfoPanels,
} from './duckFaktaTilbake';
import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';

/**
 * FaktaTilbakeIndex
 *
 * Har ansvar for faktadelen av hovedvinduet for Tilbakekreving.
 */
export const FaktaTilbakeIndex = ({
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
    resolveFaktaAksjonspunkter={resolveFaktaAksjonspunkter}
    render={(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels) => (
      <TilbakekrevingFaktaPanel
        submitCallback={submitFakta}
        toggleInfoPanelCallback={toggleInfoPanel}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      />
    )}
  />
);

FaktaTilbakeIndex.propTypes = {
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
  resetFakta,
  resolveFaktaAksjonspunkter,
});


const TrackRouteParamFaktaIndex = trackRouteParam({
  paramName: 'fakta',
  parse: parseFaktaParam,
  paramPropType: PropTypes.arrayOf(PropTypes.string),
  storeParam: setOpenInfoPanels,
  getParamFromStore: getOpenInfoPanels,
  isQueryParam: true,
  paramsAreEqual,
})(connect(mapStateToProps)(FaktaTilbakeIndex));

export default TrackRouteParamFaktaIndex;
