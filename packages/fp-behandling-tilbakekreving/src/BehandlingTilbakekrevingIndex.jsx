import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { AdvarselModal } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { BehandlingGrid, CommonBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingDataResolver from './TilbakekrevingDataResolver';
import BehandlingsprosessTilbakekrevingIndex from './behandlingsprosess/BehandlingsprosessTilbakekrevingIndex';
import FaktaTilbakeIndex from './fakta/FaktaTilbakeIndex';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getHasShownBehandlingPaVent,
  getTilbakekrevingKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo as setBehandlingInfoFunc,
  setHasShownBehandlingPaVent as setHasShownBehandlingPaVentFunc,
  updateOnHold as updateOnHoldFunc,
  hasOpenRevurdering,
  shouldUpdateFagsak as shouldUpdateFagsakSel,
} from './duckBehandlingTilbakekreving';
import FpTilbakeBehandlingUpdater from './FpTilbakeBehandlingUpdater';

/**
 * BehandlingTilbakekrevingIndex
 *
 * Bruker CommonBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingTilbakekrevingIndex = ({
  behandlingId,
  behandlingIdentifier,
  oppdaterBehandlingVersjon,
  behandlingVersjon,
  fristBehandlingPaaVent,
  behandlingPaaVent,
  venteArsakKode,
  hasManualPaVent,
  ventearsaker,
  isInSync,
  fagsakInfo,
  resetBehandling,
  behandlingUpdater,
  hasShownBehandlingPaVent,
  fetchBehandling,
  updateOnHold,
  setHasShownBehandlingPaVent,
  setBehandlingInfo,
  hasSubmittedPaVentForm,
  showOpenRevurderingModal,
  shouldUpdateFagsak,
}) => {
  const [showModal, setShowModal] = useState(showOpenRevurderingModal);
  useEffect(() => {
    setShowModal(showOpenRevurderingModal);
  }, [showOpenRevurderingModal]);
  return (
    <>
      <CommonBehandlingIndex
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        behandlingIdentifier={behandlingIdentifier}
        behandlingPaaVent={behandlingPaaVent}
        fristBehandlingPaaVent={fristBehandlingPaaVent}
        hasShownBehandlingPaVent={hasShownBehandlingPaVent}
        setHasShownBehandlingPaVent={setHasShownBehandlingPaVent}
        updateOnHold={updateOnHold}
        hasSubmittedPaVentForm={hasSubmittedPaVentForm}
        venteArsakKode={venteArsakKode}
        ventearsaker={ventearsaker}
        hasManualPaVent={hasManualPaVent}
        isInSync={isInSync}
        fagsakInfo={fagsakInfo}
        fetchBehandling={fetchBehandling}
        resetBehandlingFpsakContext={resetBehandling}
        setBehandlingInfo={setBehandlingInfo}
        fpBehandlingUpdater={FpTilbakeBehandlingUpdater}
        behandlingUpdater={behandlingUpdater}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        shouldUpdateFagsak={shouldUpdateFagsak}
      >
        <TilbakekrevingDataResolver>
          <BehandlingGrid
            behandlingsprosessContent={<BehandlingsprosessTilbakekrevingIndex />}
            faktaContent={<FaktaTilbakeIndex />}
          />
          {showModal && (
          <AdvarselModal
            headerTextCode="BehandlingTilbakekrevingIndex.ApenRevurderingHeader"
            textCode="BehandlingTilbakekrevingIndex.ApenRevurdering"
            showModal
            submit={() => setShowModal(false)}
          />
          )}
        </TilbakekrevingDataResolver>
      </CommonBehandlingIndex>
    </>
  );
};

BehandlingTilbakekrevingIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  behandlingVersjon: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  venteArsakKode: PropTypes.string,
  hasManualPaVent: PropTypes.bool.isRequired,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  isInSync: PropTypes.bool.isRequired,
  hasShownBehandlingPaVent: PropTypes.bool.isRequired,
  resetBehandling: PropTypes.func.isRequired,
  setHasShownBehandlingPaVent: PropTypes.func.isRequired,
  fetchBehandling: PropTypes.func.isRequired,
  updateOnHold: PropTypes.func.isRequired,
  setBehandlingInfo: PropTypes.func.isRequired,
  fagsakInfo: PropTypes.shape().isRequired,
  behandlingUpdater: PropTypes.shape().isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
  showOpenRevurderingModal: PropTypes.bool.isRequired,
  shouldUpdateFagsak: PropTypes.bool.isRequired,
};

const showOpenRevurderingModal = createSelector([hasOpenRevurdering, behandlingSelectors.getBehandlingIsOnHold], (
  hasOpenRev, isBehandlingOnHold,
) => hasOpenRev && !isBehandlingOnHold);

const createFagsakInfo = createSelector([
  (state, ownProps) => ownProps.saksnummer,
  (state, ownProps) => ownProps.behandlingId,
  (state, ownProps) => ownProps.fagsak,
  (state, ownProps) => ownProps.navAnsatt,
  (state, ownProps) => ownProps.fagsakBehandlingerInfo], (
  fagsakSaksnummer, behandlingId, fagsak, navAnsatt, fagsakBehandlingerInfo,
) => ({
  fagsakSaksnummer,
  behandlingId,
  fagsak,
  navAnsatt,
  fagsakBehandlingerInfo,
}));

const mapStateToProps = (state, ownProps) => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  fristBehandlingPaaVent: behandlingSelectors.getBehandlingOnHoldDate(state),
  behandlingPaaVent: behandlingSelectors.getBehandlingIsOnHold(state),
  venteArsakKode: behandlingSelectors.getBehandlingVenteArsakKode(state),
  hasManualPaVent: behandlingSelectors.hasBehandlingManualPaVent(state),
  hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
  ventearsaker: getTilbakekrevingKodeverk(kodeverkTyper.VENT_AARSAK)(state),
  isInSync: behandlingSelectors.isBehandlingInSync(state),
  showOpenRevurderingModal: showOpenRevurderingModal(state),
  fagsakInfo: createFagsakInfo(state, ownProps),
  shouldUpdateFagsak: shouldUpdateFagsakSel(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHasShownBehandlingPaVent: setHasShownBehandlingPaVentFunc,
  updateOnHold: updateOnHoldFunc,
  setBehandlingInfo: setBehandlingInfoFunc,
  resetBehandling: resetBehandlingFpsakContext,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingTilbakekrevingIndex);
