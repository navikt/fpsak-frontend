import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  sakOperations, BehandlingErPaVentModal, BehandlingGrid, BehandlingIdentifier,
} from '@fpsak-frontend/fp-behandling-felles';
import PapirsoknadInfoSetter from './PapirsoknadInfoSetter';
import PapirsoknadResolver from './PapirsoknadResolver';
import PapirsoknadIndex from './PapirsoknadIndex';
import {
  getBehandlingVersjon, getBehandlingOnHoldDate, getBehandlingVenteArsakKode, getBehandlingIsOnHold,
  hasBehandlingManualPaVent,
} from './selectors/papirsoknadSelectors';
import {
  setHasShownBehandlingPaVent, setBehandlingInfo, updateOnHold, getBehandlingIdentifier,
  getHasShownBehandlingPaVent, resetPapirsoknadContext, getKodeverk,
} from './duck';
import { getBehandlingFormPrefix } from './behandlingForm';
import papirsoknadUpdater from './PapirsoknadUpdater';

/**
 * BehandlingPapirsoknadIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingPapirsoknadIndex extends Component {
  constructor() {
    super();
    this.didGetNewBehandlingVersion = this.didGetNewBehandlingVersion.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  componentDidMount() {
    const {
      setBehandlingInfo: setInfo, saksnummer, behandlingId, behandlingUpdater, appContextUpdater, kodeverk, fagsak,
    } = this.props;
    setInfo({
      behandlingId, fagsakSaksnummer: saksnummer, kodeverk, fagsak,
    });

    behandlingUpdater.setUpdater(papirsoknadUpdater);
    sakOperations.withUpdateFagsakInfo(appContextUpdater.updateFagsakInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.didGetNewBehandlingVersion(prevProps)) {
      this.cleanUp(prevProps.behandlingId, prevProps.behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { behandlingId, behandlingVersjon, resetPapirsoknadContext: resetPapirsoknad } = this.props;
    resetPapirsoknad();
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
      <PapirsoknadResolver behandlingerVersjonMappedById={behandlingerVersjonMappedById}>
        <PapirsoknadInfoSetter setBehandlingInfoHolder={setBehandlingInfoHolder} />
        <BehandlingGrid papirsoknadContent={<PapirsoknadIndex />} />
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
      </PapirsoknadResolver>
    );
  }
}

BehandlingPapirsoknadIndex.propTypes = {
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
  resetPapirsoknadContext: PropTypes.func.isRequired,
  appContextUpdater: PropTypes.shape().isRequired,
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

BehandlingPapirsoknadIndex.defaultProps = {
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
  resetPapirsoknadContext,
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingPapirsoknadIndex);
