import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  BehandlingGrid, BehandlingErPaVentModal, sakOperations, BehandlingIdentifier,
} from '@fpsak-frontend/fp-behandling-felles';
import FpSakBehandlingInfoSetter from './FpSakBehandlingInfoSetter';
import FpSakBehandlingResolver from './FpSakBehandlingResolver';
import BehandlingsprosessIndex from './behandlingsprosess/BehandlingsprosessIndex';
import FaktaIndex from './fakta/FaktaIndex';
import {
  getBehandlingVersjon, getBehandlingOnHoldDate, getBehandlingVenteArsakKode, getBehandlingIsOnHold,
  hasBehandlingManualPaVent,
} from './behandlingSelectors';
import {
  setHasShownBehandlingPaVent, setBehandlingInfo, updateOnHold, getBehandlingIdentifier,
  getHasShownBehandlingPaVent, resetBehandlingFpsakContext, getKodeverk,
} from './duck';
import { getBehandlingFormPrefix } from './behandlingForm';
import fpSakBehandlingUpdater from './FpSakBehandlingUpdater';

/**
 * BehandlingFpsakIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingFpsakIndex extends Component {
  constructor() {
    super();
    this.didGetNewBehandlingVersion = this.didGetNewBehandlingVersion.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  componentDidMount() {
    const {
      setBehandlingInfo: setInfo, saksnummer, behandlingId, behandlingUpdater, appContextUpdater,
      featureToggles, filteredReceivedDocuments, kodeverk, fagsak,
    } = this.props;
    setInfo({
      behandlingId, fagsakSaksnummer: saksnummer, featureToggles, filteredReceivedDocuments, kodeverk, fagsak,
    });

    behandlingUpdater.setUpdater(fpSakBehandlingUpdater);
    sakOperations.withUpdateFagsakInfo(appContextUpdater.updateFagsakInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.didGetNewBehandlingVersion(prevProps)) {
      this.cleanUp(prevProps.behandlingId, prevProps.behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { behandlingId, behandlingVersjon, resetBehandlingFpsakContext: resetBehandling } = this.props;
    resetBehandling();
    this.cleanUp(behandlingId, behandlingVersjon);
  }

  didGetNewBehandlingVersion(prevProps) {
    const { behandlingVersjon } = this.props;
    return prevProps.behandlingVersjon !== behandlingVersjon;
  }

  cleanUp(behandlingId, behandlingVersjon) {
    const { destroyReduxForms: destroyForms } = this.props;
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    setTimeout(() => destroyForms(behandlingFormPrefix), 1000); // Delay destruction to after potentially expensive transition
  }

  render() {
    const {
      hasShownBehandlingPaVent,
      behandlingId,
      behandlingPaaVent,
      fristBehandlingPaaVent,
      venteArsakKode,
      closeBehandlingOnHoldModal,
      handleOnHoldSubmit,
      hasSubmittedPaVentForm,
      hasManualPaVent,
      behandlingerVersjonMappedById,
      setBehandlingInfoHolder,
      ventearsaker,
      behandlingIdentifier,
    } = this.props;
    if (!behandlingIdentifier || behandlingIdentifier.behandlingId !== behandlingId) {
      return <LoadingPanel />;
    }

    return (
      <FpSakBehandlingResolver behandlingerVersjonMappedById={behandlingerVersjonMappedById}>
        <FpSakBehandlingInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
        <BehandlingGrid
          behandlingsprosessContent={<BehandlingsprosessIndex />}
          faktaContent={<FaktaIndex />}
        />
        {!hasSubmittedPaVentForm
          && (
          <BehandlingErPaVentModal
            showModal={!hasShownBehandlingPaVent && behandlingPaaVent}
            closeEvent={closeBehandlingOnHoldModal}
            behandlingId={behandlingId}
            fristBehandlingPaaVent={fristBehandlingPaaVent}
            venteArsakKode={venteArsakKode}
            handleOnHoldSubmit={handleOnHoldSubmit}
            hasManualPaVent={hasManualPaVent}
            ventearsaker={ventearsaker}
          />
          )
        }
      </FpSakBehandlingResolver>
    );
  }
}

BehandlingFpsakIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  venteArsakKode: PropTypes.string,
  hasShownBehandlingPaVent: PropTypes.bool.isRequired,
  closeBehandlingOnHoldModal: PropTypes.func.isRequired,
  handleOnHoldSubmit: PropTypes.func.isRequired,
  destroyReduxForms: PropTypes.func.isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
  hasManualPaVent: PropTypes.bool.isRequired,
  setBehandlingInfo: PropTypes.func.isRequired,
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
  behandlingUpdater: PropTypes.shape().isRequired,
  resetBehandlingFpsakContext: PropTypes.func.isRequired,
  appContextUpdater: PropTypes.shape().isRequired,
  featureToggles: PropTypes.shape().isRequired,
  filteredReceivedDocuments: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  })).isRequired,
  kodeverk: PropTypes.shape().isRequired,
  fagsak: PropTypes.shape({
    fagsakStatus: PropTypes.shape().isRequired,
    fagsakPerson: PropTypes.shape().isRequired,
    fagsakYtelseType: PropTypes.shape().isRequired,
    isForeldrepengerFagsak: PropTypes.bool.isRequired,
  }).isRequired,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
};

BehandlingFpsakIndex.defaultProps = {
  fristBehandlingPaaVent: undefined,
  behandlingPaaVent: false,
  behandlingVersjon: undefined,
  venteArsakKode: undefined,
  ventearsaker: [],
  behandlingIdentifier: undefined,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  fristBehandlingPaaVent: getBehandlingOnHoldDate(state),
  behandlingPaaVent: getBehandlingIsOnHold(state),
  venteArsakKode: getBehandlingVenteArsakKode(state),
  hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
  hasManualPaVent: hasBehandlingManualPaVent(state),
  ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  setBehandlingInfo,
  resetBehandlingFpsakContext,
  destroyReduxForms: destroy,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleOnHoldSubmit: (formData) => {
    const { behandlingId } = ownProps;
    const { behandlingIdentifier, behandlingVersjon } = stateProps;
    return dispatchProps.updateOnHold({ ...formData, behandlingId, behandlingVersjon }, behandlingIdentifier)
      .then(() => {
        dispatchProps.setHasShownBehandlingPaVent();
      });
  },
  closeBehandlingOnHoldModal: () => dispatchProps.setHasShownBehandlingPaVent(),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingFpsakIndex);