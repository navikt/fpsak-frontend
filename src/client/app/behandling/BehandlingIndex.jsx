import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';

import BehandlingsprosessIndex from 'behandlingsprosess/BehandlingsprosessIndex';
import FaktaIndex from 'fakta/FaktaIndex';
import { getPapirsoknadEnabled } from 'papirsoknad/duck';
import PapirsoknadIndex from 'papirsoknad/PapirsoknadIndex';
import trackRouteParam from 'app/data/trackRouteParam';
import requireProps from 'app/data/requireProps';
import { getHasSubmittedPaVentForm } from 'behandlingmenu/duck';
import BehandlingResolver from './BehandlingResolver';
import {
  getBehandlingVersjon, getBehandlingOnHoldDate, getBehandlingVenteArsakKode, getBehandlingIsOnHold,
  getSelectedBehandlingIdentifier, hasBehandlingManualPaVent,
} from './behandlingSelectors';
import {
  setHasShownBehandlingPaVent, setSelectedBehandlingId, getSelectedBehandlingId, updateOnHold,
  getHasShownBehandlingPaVent,
} from './duck';
import { getBehandlingFormPrefix } from './behandlingForm';
import BehandlingGrid from './components/BehandlingGrid';
import BehandlingErPaVentModal from './components/BehandlingErPaVentModal';

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component {
  constructor() {
    super();
    this.didGetNewBehandlingVersion = this.didGetNewBehandlingVersion.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.didGetNewBehandlingVersion(prevProps)) {
      this.cleanUp(prevProps.behandlingId, prevProps.behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { behandlingId, behandlingVersjon } = this.props;
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
      behandlingsprosessEnabled,
      faktaEnabled,
      papirsoknadEnabled,
      hasShownBehandlingPaVent,
      behandlingId,
      behandlingPaaVent,
      fristBehandlingPaaVent,
      venteArsakKode,
      closeBehandlingOnHoldModal,
      handleOnHoldSubmit,
      hasSubmittedPaVentForm,
      hasManualPaVent,
    } = this.props;

    return (
      <BehandlingResolver key={behandlingId}>
        <BehandlingGrid
          behandlingsprosessContent={behandlingsprosessEnabled && <BehandlingsprosessIndex />}
          faktaContent={faktaEnabled && <FaktaIndex />}
          papirsoknadContent={papirsoknadEnabled && <PapirsoknadIndex />}
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
          />
          )
        }
      </BehandlingResolver>
    );
  }
}

BehandlingIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  fristBehandlingPaaVent: PropTypes.string,
  behandlingPaaVent: PropTypes.bool,
  venteArsakKode: PropTypes.string,
  behandlingsprosessEnabled: PropTypes.bool.isRequired,
  faktaEnabled: PropTypes.bool.isRequired,
  papirsoknadEnabled: PropTypes.bool.isRequired,
  hasShownBehandlingPaVent: PropTypes.bool.isRequired,
  closeBehandlingOnHoldModal: PropTypes.func.isRequired,
  handleOnHoldSubmit: PropTypes.func.isRequired,
  destroyReduxForms: PropTypes.func.isRequired,
  hasSubmittedPaVentForm: PropTypes.bool.isRequired,
  hasManualPaVent: PropTypes.bool.isRequired,
};

BehandlingIndex.defaultProps = {
  fristBehandlingPaaVent: undefined,
  behandlingPaaVent: false,
  behandlingVersjon: undefined,
  venteArsakKode: undefined,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  fristBehandlingPaaVent: getBehandlingOnHoldDate(state),
  behandlingPaaVent: getBehandlingIsOnHold(state),
  venteArsakKode: getBehandlingVenteArsakKode(state),
  behandlingsprosessEnabled: !getPapirsoknadEnabled(state),
  faktaEnabled: !getPapirsoknadEnabled(state),
  papirsoknadEnabled: getPapirsoknadEnabled(state),
  hasShownBehandlingPaVent: getHasShownBehandlingPaVent(state),
  hasSubmittedPaVentForm: getHasSubmittedPaVentForm(state),
  hasManualPaVent: hasBehandlingManualPaVent(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setHasShownBehandlingPaVent,
  updateOnHold,
  destroyReduxForms: destroy,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  handleOnHoldSubmit: (formData) => {
    const { behandlingIdentifier, behandlingId, behandlingVersjon } = stateProps;
    return dispatchProps.updateOnHold({ ...formData, behandlingId, behandlingVersjon }, behandlingIdentifier)
      .then(() => {
        dispatchProps.setHasShownBehandlingPaVent();
      });
  },
  closeBehandlingOnHoldModal: () => dispatchProps.setHasShownBehandlingPaVent(),
});

export default trackRouteParam({
  paramName: 'behandlingId',
  parse: saksnummerFromUrl => Number.parseInt(saksnummerFromUrl, 10),
  paramPropType: PropTypes.number,
  storeParam: setSelectedBehandlingId,
  getParamFromStore: getSelectedBehandlingId,
})(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['behandlingId'])(BehandlingIndex)));
