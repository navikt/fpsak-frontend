import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { BehandlingGrid, CommonBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/innsynBehandlingSelectors';
import FpInnsynBehandlingInfoSetter from './FpInnsynBehandlingInfoSetter';
import BehandlingsprosessInnsynIndex from './behandlingsprosess/BehandlingsprosessInnsynIndex';
import FaktaInnsynIndex from './fakta/FaktaInnsynIndex';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getHasShownBehandlingPaVent,
  getKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo as setBehandlingInfoFunc,
  setHasShownBehandlingPaVent as setHasShownBehandlingPaVentFunc,
  updateOnHold as updateOnHoldFunc,
} from './duckBehandlingInnsyn';
import fpInnsynBehandlingUpdater from './FpInnsynBehandlingUpdater';

/**
 * BehandlingInnsynIndex
 *
 * Bruker CommonBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingInnsynIndex = ({
  behandlingId,
  behandlingIdentifier,
  behandlingerVersjonMappedById,
  setBehandlingInfoHolder,
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
  appContextUpdater,
  hasShownBehandlingPaVent,
  fetchBehandling,
  updateOnHold,
  setHasShownBehandlingPaVent,
  setBehandlingInfo,
  hasSubmittedPaVentForm,
}) => (
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
    behandlingerVersjonMappedById={behandlingerVersjonMappedById}
    appContextUpdater={appContextUpdater}
    setBehandlingInfo={setBehandlingInfo}
    fpBehandlingUpdater={fpInnsynBehandlingUpdater}
    behandlingUpdater={behandlingUpdater}
  >
    <FpInnsynBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessInnsynIndex />}
      faktaContent={<FaktaInnsynIndex />}
    />
  </CommonBehandlingIndex>
);

BehandlingInnsynIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
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
  appContextUpdater: PropTypes.shape().isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
};

BehandlingInnsynIndex.defaultProps = {
  behandlingVersjon: undefined,
  behandlingIdentifier: undefined,
  fristBehandlingPaaVent: undefined,
  behandlingPaaVent: false,
  venteArsakKode: undefined,
  ventearsaker: [],
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    featureToggles: ownProps.featureToggles,
    kodeverk: ownProps.kodeverk,
    fagsak: ownProps.fagsak,
    allDocuments: ownProps.allDocuments,
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
    ventearsaker: getKodeverk(kodeverkTyper.VENT_AARSAK)(state),
    isInSync: behandlingSelectors.isBehandlingInSync(state),
    fagsakInfo,
  });
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setHasShownBehandlingPaVent: setHasShownBehandlingPaVentFunc,
  updateOnHold: updateOnHoldFunc,
  setBehandlingInfo: setBehandlingInfoFunc,
  resetBehandling: resetBehandlingFpsakContext,
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToPropsFactory, mapDispatchToProps)(BehandlingInnsynIndex);
