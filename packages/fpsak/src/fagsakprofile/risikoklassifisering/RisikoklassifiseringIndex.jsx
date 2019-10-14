import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { getRiskPanelLocationCreator, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import RisikoklassifiseringSakIndex from '@fpsak-frontend/sak-risikoklassifisering';

import { getBehandlingIdentifier, getBehandlingVersjon } from 'behandling/duck';
import {
  hentKontrollresultat, isRiskPanelOpen, resolveAksjonspunkter, setRiskPanelOpen,
} from './duck';
import { getKontrollresultat, getReadOnly, getRisikoaksjonspunkt } from './kontrollresultatSelectors';

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
export class RisikoklassifiseringIndexImpl extends Component {
  componentDidMount = () => {
    this.finnKontrollresultat();
    this.apnePanelVedAksjonspunkt();
  }

  componentDidUpdate = (prevProps) => {
    this.apnePanelVedAksjonspunkt();
    this.updateVedNyVersjon(prevProps.behandlingVersjon);
  }

  finnKontrollresultat = () => {
    const { behandlingIdentifier, hentKontrollresultat: hentResultat } = this.props;

    if (behandlingIdentifier) {
      const params = {
        ...behandlingIdentifier.toJson(),
      };
      hentResultat(params);
    }
  }

updateVedNyVersjon = (prevBehandlingversjon) => {
  const { behandlingVersjon, behandlingIdentifier, hentKontrollresultat: hentResultat } = this.props;
  if (behandlingIdentifier && behandlingVersjon !== prevBehandlingversjon) {
    const params = {
      ...behandlingIdentifier.toJson(),
    };
    hentResultat(params);
  }
}

  apnePanelVedAksjonspunkt = () => {
    const { aksjonspunkt, isPanelOpen } = this.props;
    if (aksjonspunkt && aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET) {
      if (!isPanelOpen) {
        this.toggleRiskPanel();
      }
    }
  }

  submitAksjonspunkter = (aksjonspunkter) => {
    const {
      behandlingIdentifier,
      behandlingVersjon,
      resolveAksjonspunkter: resolveAp,
    } = this.props;
    const model = aksjonspunkter.map((ap) => ({
      '@type': ap.kode,
      ...ap,
    }));

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: model,
    };

    return resolveAp(
      params,
      behandlingIdentifier,
    );
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
      aksjonspunkt,
      risikoklassifisering,
      isPanelOpen,
      readOnly,
      behandlingIdentifier,
      behandlingVersjon,
    } = this.props;

    return (
      <RisikoklassifiseringSakIndex
        behandlingId={behandlingIdentifier.behandlingId}
        behandlingVersjon={behandlingVersjon}
        aksjonspunkt={aksjonspunkt}
        risikoklassifisering={risikoklassifisering}
        isPanelOpen={isPanelOpen}
        readOnly={readOnly}
        submitAksjonspunkter={this.submitAksjonspunkter}
        toggleRiskPanel={this.toggleRiskPanel}
      />
    );
  }
}

RisikoklassifiseringIndexImpl.propTypes = {
  hentKontrollresultat: PropTypes.func.isRequired,
  resolveAksjonspunkter: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  isPanelOpen: PropTypes.bool.isRequired,
  setRiskPanelOpen: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.shape(),
  behandlingVersjon: PropTypes.number,
  risikoklassifisering: PropTypes.shape(),
  aksjonspunkt: aksjonspunktPropType,
};

RisikoklassifiseringIndexImpl.defaultProps = {
  risikoklassifisering: undefined,
  aksjonspunkt: undefined,
  behandlingVersjon: undefined,
  behandlingIdentifier: undefined,
};

const mapStateToProps = (state) => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkt: getRisikoaksjonspunkt(state),
  risikoklassifisering: getKontrollresultat(state),
  isPanelOpen: isRiskPanelOpen(state),
  readOnly: getReadOnly(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    hentKontrollresultat,
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
