import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { BehandlingGrid, CommonBehandlingIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import FpSakBehandlingInfoSetter from './FpSakBehandlingInfoSetter';
import BehandlingsprosessForstegangOgRevIndex from './behandlingsprosess/BehandlingsprosessForstegangOgRevIndex';
import FaktaIndex from './fakta/FaktaIndex';
import {
  fetchBehandling as fetchBehandlingActionCreator,
  getBehandlingIdentifier,
  getHasShownBehandlingPaVent,
  getKodeverk,
  resetBehandlingFpsakContext,
  setBehandlingInfo as setBehandlingInfoFunc,
  setHasShownBehandlingPaVent as setHasShownBehandlingPaVentFunc,
  updateOnHold as updateOnHoldFunc,
} from './duckBehandlingForstegangOgRev';
import FpSakBehandlingUpdater from './FpSakBehandlingUpdater';

/**
 * BehandlingForstegangOgRevurderingIndex
 *
 * Bruker CommonBehandlingIndex for å styrer livssyklusen til de mekanismene som er relatert til den valgte behandlingen.
 */
export const BehandlingForstegangOgRevurderingIndex = ({
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
    fpBehandlingUpdater={FpSakBehandlingUpdater}
    behandlingUpdater={behandlingUpdater}
  >
    <FpSakBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
    <BehandlingGrid
      behandlingsprosessContent={<BehandlingsprosessForstegangOgRevIndex />}
      faktaContent={<FaktaIndex />}
    />
  </CommonBehandlingIndex>
);

BehandlingForstegangOgRevurderingIndex.propTypes = {
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const fagsakInfo = {
    fagsakSaksnummer: ownProps.saksnummer,
    behandlingId: ownProps.behandlingId,
    featureToggles: ownProps.featureToggles,
    kodeverk: ownProps.kodeverk,
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
    ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
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

export default connect(mapStateToPropsFactory, mapDispatchToProps)(BehandlingForstegangOgRevurderingIndex);
