import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingErPaVentModal, BehandlingIdentifier, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';

import CommonBehandlingResolver from './CommonBehandlingResolver';

export class CommonBehandlingIndex extends Component {
  componentDidMount = () => {
    const {
      setBehandlingInfo: setInfo, behandlingUpdater, fagsakInfo, fpBehandlingUpdater,
    } = this.props;

    setInfo(fagsakInfo);
    behandlingUpdater.setUpdater(fpBehandlingUpdater);
  }

  componentDidUpdate = (prevProps) => {
    const { oppdaterBehandlingVersjon, behandlingVersjon, shouldUpdateFagsak } = this.props;
    if (this.didGetNewBehandlingVersion(prevProps)) {
      if (shouldUpdateFagsak) {
        oppdaterBehandlingVersjon(behandlingVersjon);
      }
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
      isInSync,
      fetchBehandling,
      children,
    } = this.props;
    if (!behandlingIdentifier || behandlingIdentifier.behandlingId !== behandlingId) {
      return <LoadingPanel />;
    }
    return (
      <CommonBehandlingResolver
        isInSync={isInSync}
        fetchBehandling={fetchBehandling}
        behandlingIdentifier={behandlingIdentifier}
      >
        {children}
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

CommonBehandlingIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  setBehandlingInfo: PropTypes.func.isRequired,
  behandlingPaaVent: PropTypes.bool,
  venteArsakKode: PropTypes.string,
  hasShownBehandlingPaVent: PropTypes.bool.isRequired,
  closeBehandlingOnHoldModal: PropTypes.func.isRequired,
  handleOnHoldSubmit: PropTypes.func.isRequired,
  fpBehandlingUpdater: PropTypes.shape().isRequired,
  destroyReduxForms: PropTypes.func.isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
  hasManualPaVent: PropTypes.bool.isRequired,
  behandlingUpdater: PropTypes.shape().isRequired,
  resetBehandlingFpsakContext: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  shouldUpdateFagsak: PropTypes.bool,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  isInSync: PropTypes.bool.isRequired,
  fetchBehandling: PropTypes.func.isRequired,
  fagsakInfo: PropTypes.shape().isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

CommonBehandlingIndex.defaultProps = {
  fristBehandlingPaaVent: undefined,
  behandlingPaaVent: false,
  behandlingVersjon: undefined,
  venteArsakKode: undefined,
  ventearsaker: [],
  behandlingIdentifier: undefined,
  shouldUpdateFagsak: true,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  destroyReduxForms: destroy,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleOnHoldSubmit: (formData) => {
    const {
      behandlingId,
      behandlingIdentifier,
      behandlingVersjon,
      updateOnHold,
      setHasShownBehandlingPaVent,
    } = ownProps;
    return updateOnHold({ ...formData, behandlingId, behandlingVersjon }, behandlingIdentifier)
      .then(() => {
        setHasShownBehandlingPaVent();
      });
  },
  closeBehandlingOnHoldModal: () => ownProps.setHasShownBehandlingPaVent(),
});

export default connect(() => ({}), mapDispatchToProps, mergeProps)(CommonBehandlingIndex);
