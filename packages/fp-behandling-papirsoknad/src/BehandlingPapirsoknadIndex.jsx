import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, withBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/papirsoknadSelectors';
import PapirsoknadInfoSetter from './PapirsoknadInfoSetter';
import PapirsoknadIndex from './PapirsoknadIndex';
import {
  setHasShownBehandlingPaVent, setBehandlingInfo, updateOnHold, getBehandlingIdentifier,
  getHasShownBehandlingPaVent, resetRegistreringSuccess, getKodeverk, fetchBehandling as fetchBehandlingActionCreator,
} from './duckPapirsoknad';
import PapirsoknadUpdater from './PapirsoknadUpdater';

/**
 * BehandlingPapirsoknadIndex
 *
 * Bruker HOC withBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingPapirsoknadIndex = ({
  setBehandlingInfoHolder,
}) => (
  <>
    <PapirsoknadInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid papirsoknadContent={<PapirsoknadIndex />} />
  </>
);

BehandlingPapirsoknadIndex.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
};

// Definerer mapStateToPropsFactory og mapDispatchToProps her og send inn til HOC (Bruker papirsøknad-spesifikke selectors og funksjoner)
const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    kodeverk: ownProps.kodeverk,
    fagsak: ownProps.fagsak,
  };

  return state => ({
    behandlingIdentifier: getBehandlingIdentifier(state),
    behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
    fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
    behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
    venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
    hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
    hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
    ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
    isInSync: behandlingSelectors.isBehandlingInSync(state),
    fagsakInfo,
  });
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext: resetRegistreringSuccess,
  destroyReduxForms: destroy,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default withBehandlingIndex(mapStateToPropsFactory, mapDispatchToProps, PapirsoknadUpdater)(BehandlingPapirsoknadIndex);
