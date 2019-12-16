import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { allAccessRights, getRiskPanelLocationCreator, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';

import { getBehandlingerErPaaVentStatusMappedById } from '../../behandling/selectors/behandlingerSelectors';
import { getNavAnsatt } from '../../app/duck';
import { getSelectedFagsakStatus } from '../../fagsak/fagsakSelectors';
import {
  getBehandlingIdentifier, getBehandlingVersjon, getSelectedBehandlingId, getBehandlingStatus, getBehandlingType,
} from '../../behandling/duck';
import {
  isRiskPanelOpen, resolveAksjonspunkter, setRiskPanelOpen,
} from './duck';

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
export class RisikoklassifiseringIndexImpl extends Component {
  componentDidMount = () => {
    this.apnePanelVedAksjonspunkt();
  }

  componentDidUpdate = () => {
    this.apnePanelVedAksjonspunkt();
  }

  apnePanelVedAksjonspunkt = () => {
    const { risikoAksjonspunkt, isPanelOpen } = this.props;
    if (risikoAksjonspunkt && risikoAksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET) {
      if (!isPanelOpen) {
        this.toggleRiskPanel();
      }
    }
  }

  submitAksjonspunkt = (aksjonspunkt) => {
    const {
      behandlingIdentifier,
      behandlingVersjon,
      resolveAksjonspunkter: resolveAp,
    } = this.props;

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [{
        '@type': aksjonspunkt.kode,
        ...aksjonspunkt,
      }],
    };

    return resolveAp(params, behandlingIdentifier);
  }

  toggleRiskPanel = () => {
    const {
      push: pushLocation, location, isPanelOpen, setRiskPanelOpen: setOpen,
    } = this.props;
    pushLocation(getRiskPanelLocationCreator(location)(!isPanelOpen));
    // TODO (TOR) Dette trur eg ikkje skal vera naudsynt. Bør automatisk synce url til store
    setOpen(!isPanelOpen);
  }

  render() {
    const {
      risikoAksjonspunkt,
      kontrollresultat,
      isPanelOpen,
      readOnly,
      behandlingIdentifier,
      behandlingVersjon,
    } = this.props;

    return (
      <RisikoklassifiseringSakIndex
        behandlingId={behandlingIdentifier ? behandlingIdentifier.behandlingId : undefined}
        behandlingVersjon={behandlingVersjon}
        aksjonspunkt={risikoAksjonspunkt}
        risikoklassifisering={kontrollresultat}
        isPanelOpen={isPanelOpen}
        readOnly={readOnly}
        submitAksjonspunkt={this.submitAksjonspunkt}
        toggleRiskPanel={this.toggleRiskPanel}
      />
    );
  }
}

RisikoklassifiseringIndexImpl.propTypes = {
  resolveAksjonspunkter: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  isPanelOpen: PropTypes.bool,
  setRiskPanelOpen: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.shape(),
  behandlingVersjon: PropTypes.number,
  kontrollresultat: PropTypes.shape(),
  risikoAksjonspunkt: aksjonspunktPropType,
};

RisikoklassifiseringIndexImpl.defaultProps = {
  kontrollresultat: undefined,
  risikoAksjonspunkt: undefined,
  behandlingVersjon: undefined,
  behandlingIdentifier: undefined,
  isPanelOpen: false,
};

const getRettigheter = createSelector([
  getNavAnsatt,
  getSelectedFagsakStatus,
  getBehandlingStatus,
  getBehandlingType,
], allAccessRights);

const getReadOnly = createSelector([getRettigheter, getNavAnsatt, getBehandlingerErPaaVentStatusMappedById, getSelectedBehandlingId],
  (rettigheter, navAnsatt, erPaaVentMap, selectedBehandlingId) => {
    const erPaaVent = erPaaVentMap && getSelectedBehandlingId ? erPaaVentMap[selectedBehandlingId] : false;
    if (erPaaVent) {
      return true;
    }
    const { kanSaksbehandle } = navAnsatt;
    return !kanSaksbehandle || !rettigheter.writeAccess.isEnabled;
  });

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  isPanelOpen: isRiskPanelOpen(state),
  readOnly: getReadOnly(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    dispatchSubmitFailed,
    resolveAksjonspunkter,
    setRiskPanelOpen,
  }, dispatch),
});

export default trackRouteParam({
  paramName: 'risiko',
  parse: (isOpen) => isOpen === 'true',
  paramPropType: PropTypes.bool,
  storeParam: setRiskPanelOpen,
  getParamFromStore: isRiskPanelOpen,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(RisikoklassifiseringIndexImpl));
