import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingIdentifier, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { CommonFaktaIndex, parseFaktaParam, paramsAreEqual } from '@fpsak-frontend/fp-behandling-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import behandlingSelectors from '../selectors/forsteOgRevBehandlingSelectors';
import { getBehandlingIdentifier } from '../duckBehandlingForstegangOgRev';
import {
  getOpenInfoPanels, setOpenInfoPanels, resetFakta, resolveFaktaAksjonspunkter, resolveFaktaOverstyrAksjonspunkter,
} from './duckFaktaForstegangOgRev';
import FaktaPanel from './components/FaktaPanel';

const overstyringApCodes = [ac.OVERSTYR_AVKLAR_FAKTA_UTTAK, ac.OVERSTYR_AVKLAR_STARTDATO, ac.MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
  ac.MANUELL_AVKLAR_FAKTA_UTTAK, ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

/**
 * FaktaIndex
 *
 * Har ansvar for faktadelen av hovedvinduet.
 */
export const FaktaIndex = ({
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
    resolveFaktaOverstyrAksjonspunkter={resolveFaktaOverstyrAksjonspunkter}
    overstyringApCodes={overstyringApCodes}
    render={(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels) => (
      <FaktaPanel
        submitCallback={submitFakta}
        toggleInfoPanelCallback={toggleInfoPanel}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      />
    )}
  />
);

FaktaIndex.propTypes = {
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
})(connect(mapStateToProps)(FaktaIndex));

export default TrackRouteParamFaktaIndex;
