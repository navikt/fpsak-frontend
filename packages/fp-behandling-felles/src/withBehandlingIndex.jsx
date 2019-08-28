import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingErPaVentModal, BehandlingIdentifier, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';

import sakOperations from './SakOperations';
import CommonBehandlingResolver from './CommonBehandlingResolver';

/**
 * withBehandlingIndex
 *
 * HOC-komponent som er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 */
export const withBehandlingIndex = (mapStateToPropsFactory, mapDispatchToProps, fpBehandlingUpdater) => (WrappedComponent) => {
  class BehandlingIndex extends Component {
    componentDidMount = () => {
      const {
        setBehandlingInfo: setInfo, behandlingUpdater, appContextUpdater, fagsakInfo,
      } = this.props;

      setInfo(fagsakInfo);
      behandlingUpdater.setUpdater(fpBehandlingUpdater);
      sakOperations.withUpdateFagsakInfo(appContextUpdater.updateFagsakInfo);
    }

    componentDidUpdate = (prevProps) => {
      if (this.didGetNewBehandlingVersion(prevProps)) {
        this.cleanUp(prevProps.behandlingId, prevProps.behandlingVersjon);
      }
    }

    componentWillUnmount = () => {
      const { behandlingId, behandlingVersjon, resetBehandlingFpsakContext: resetBehandling } = this.props;
      resetBehandling();
      this.cleanUp(behandlingId, behandlingVersjon);
    }

    didGetNewBehandlingVersion = (prevProps) => {
      const { behandlingVersjon } = this.props;
      return prevProps.behandlingVersjon !== behandlingVersjon;
    }

    cleanUp = (behandlingId, behandlingVersjon) => {
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
        ventearsaker,
        behandlingIdentifier,
        behandlingerVersjonMappedById,
        isInSync,
        fetchBehandling,
        setBehandlingInfoHolder,
      } = this.props;
      if (!behandlingIdentifier || behandlingIdentifier.behandlingId !== behandlingId) {
        return <LoadingPanel />;
      }
      return (
        <CommonBehandlingResolver
          isInSync={isInSync}
          fetchBehandling={fetchBehandling}
          behandlingIdentifier={behandlingIdentifier}
          behandlingerVersjonMappedById={behandlingerVersjonMappedById}
        >
          <WrappedComponent setBehandlingInfoHolder={setBehandlingInfoHolder} />
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
            )}
        </CommonBehandlingResolver>
      );
    }
  }

  BehandlingIndex.propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    fristBehandlingPaaVent: PropTypes.string,
    setBehandlingInfo: PropTypes.func.isRequired,
    behandlingPaaVent: PropTypes.bool,
    venteArsakKode: PropTypes.string,
    hasShownBehandlingPaVent: PropTypes.bool.isRequired,
    closeBehandlingOnHoldModal: PropTypes.func.isRequired,
    handleOnHoldSubmit: PropTypes.func.isRequired,
    destroyReduxForms: PropTypes.func.isRequired,
    hasSubmittedPaVentForm: PropTypes.bool.isRequired,
    hasManualPaVent: PropTypes.bool.isRequired,
    behandlingUpdater: PropTypes.shape().isRequired,
    resetBehandlingFpsakContext: PropTypes.func.isRequired,
    appContextUpdater: PropTypes.shape().isRequired,
    ventearsaker: PropTypes.arrayOf(PropTypes.shape({
      kode: PropTypes.string,
      navn: PropTypes.string,
    })),
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
    isInSync: PropTypes.bool.isRequired,
    fetchBehandling: PropTypes.func.isRequired,
    setBehandlingInfoHolder: PropTypes.func.isRequired,
    fagsakInfo: PropTypes.shape().isRequired,
  };

  BehandlingIndex.defaultProps = {
    fristBehandlingPaaVent: undefined,
    behandlingPaaVent: false,
    behandlingVersjon: undefined,
    venteArsakKode: undefined,
    ventearsaker: [],
    behandlingIdentifier: undefined,
  };

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

  return connect(mapStateToPropsFactory, mapDispatchToProps, mergeProps)(BehandlingIndex);
};

export default withBehandlingIndex;
