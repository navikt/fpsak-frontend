import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, withBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/tilbakekrevingBehandlingSelectors';
import FpTilbakeBehandlingInfoSetter from './FpTilbakeBehandlingInfoSetter';
import TilbakekrevingDataResolver from './TilbakekrevingDataResolver';
import BehandlingsprosessTilbakekrevingContainer from './behandlingsprosess/BehandlingsprosessTilbakekrevingContainer';
import FaktaTilbakeContainer from './fakta/FaktaTilbakeContainer';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getHasShownBehandlingPaVent,
  getTilbakekrevingKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo,
  setHasShownBehandlingPaVent,
  updateOnHold,
} from './duckBehandlingTilbakekreving';
import FpTilbakeBehandlingUpdater from './FpTilbakeBehandlingUpdater';

/**
 * BehandlingTilbakekrevingIndex
 *
 * Bruker HOC withBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingTilbakekrevingIndex = ({
  setBehandlingInfoHolder,
}) => (
  <TilbakekrevingDataResolver>
    <FpTilbakeBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessTilbakekrevingContainer />}
      faktaContent={<FaktaTilbakeContainer />}
    />
  </TilbakekrevingDataResolver>
);

BehandlingTilbakekrevingIndex.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
};

// Definerer mapStateToPropsFactory og mapDispatchToProps her og send inn til HOC (Bruker tilbakekreving-spesifikke selectors og funksjoner)
const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    fagsak: ownProps.fagsak,
    navAnsatt: ownProps.navAnsatt,
  };

  return (state) => ({
    behandlingIdentifier: getBehandlingIdentifier(state),
    behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
    fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
    behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
    venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
    hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
    hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
    ventearsaker: getTilbakekrevingKodeverk(kodeverkTyper.VENTEARSAK)(state),
    isInSync: behandlingSelectors.isBehandlingInSync(state),
    fagsakInfo,
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext,
  destroyReduxForms: destroy,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default withBehandlingIndex(mapStateToPropsFactory, mapDispatchToProps, FpTilbakeBehandlingUpdater)(BehandlingTilbakekrevingIndex);
