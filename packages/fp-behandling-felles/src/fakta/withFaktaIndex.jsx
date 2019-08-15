import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import {
  trackRouteParam, requireProps, getFaktaLocation, getLocationWithDefaultBehandlingspunktAndFakta, DEFAULT_FAKTA, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';

const notEmptyParam = p => p !== null && p !== undefined && p !== '';
const notDefaultParam = p => p !== DEFAULT_FAKTA;
const formatFaktaParam = (openInfoPanels = []) => openInfoPanels.filter(notEmptyParam).filter(notDefaultParam).join(',');
const parseFaktaParam = (openInfoPanels = '') => openInfoPanels.split(',').filter(notEmptyParam);
const paramsAreEqual = (a = [], b = []) => ((a.length === b.length) && a.every((param, index) => param === b[index]));

/**
 * FaktaIndex
 *
 * Container komponent. Har ansvar for faktadelen av hovedvinduet. Definerer funksjoner for henting
 * av data til underkomponentene og lagring av faktaavklaring.
 */
const withFaktaIndex = (setOpenInfoPanels, getOpenInfoPanels) => (WrappedComponent) => {
  class FaktaIndex extends Component {
    componentWillUnmount = () => {
      const { resetFakta: resetFaktaFn } = this.props;
      resetFaktaFn();
    }

    goToBehandlingWithDefaultPunktAndFakta = () => {
      const { push: pushLocation, location } = this.props;
      pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
    }

    goToOpenInfoPanels = (infoPanels) => {
      const { push: pushLocation, location } = this.props;
      pushLocation(getFaktaLocation(location)(formatFaktaParam(infoPanels)));
    }

    submitFakta = (aksjonspunkter) => {
      const {
        behandlingIdentifier,
        behandlingVersjon,
        resolveFaktaOverstyrAksjonspunkter: resolveFaktaOverstyrAp,
        resolveFaktaAksjonspunkter: resolveFaktaAp,
        overstyringApCodes,
      } = this.props;

      const model = aksjonspunkter.map(ap => ({
        '@type': ap.kode,
        ...ap,
      }));

      if (model && overstyringApCodes.includes(model[0].kode)) {
        const params = {
          ...behandlingIdentifier.toJson(),
          behandlingVersjon,
          overstyrteAksjonspunktDtoer: model,
        };

        return resolveFaktaOverstyrAp(
          params,
          behandlingIdentifier,
        ).then(() => this.goToBehandlingWithDefaultPunktAndFakta());
      }

      const params = {
        ...behandlingIdentifier.toJson(),
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: model,
      };

      return resolveFaktaAp(
        params,
        behandlingIdentifier,
      ).then(() => this.goToBehandlingWithDefaultPunktAndFakta());
    }

    toggleInfoPanel = (infoPanelToToggleId) => {
      const { openInfoPanels } = this.props;
      let infoPanels;
      if (openInfoPanels.includes(infoPanelToToggleId)) {
        infoPanels = openInfoPanels.filter(infoPanelId => infoPanelId !== infoPanelToToggleId);
      } else {
        infoPanels = [...openInfoPanels, infoPanelToToggleId];
      }
      this.goToOpenInfoPanels(infoPanels);
    }

    render = () => {
      const { shouldOpenDefaultInfoPanels } = this.props;
      return (
        <WrappedComponent
          submitCallback={this.submitFakta}
          toggleInfoPanelCallback={this.toggleInfoPanel}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
        />
      );
    }
  }

  FaktaIndex.propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    resetFakta: PropTypes.func.isRequired,
    /**
     * Oversikt over hvilke faktapaneler som er åpne
     */
    openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
    location: PropTypes.shape().isRequired,
    push: PropTypes.func.isRequired,
    resolveFaktaAksjonspunkter: PropTypes.func,
    resolveFaktaOverstyrAksjonspunkter: PropTypes.func,
    shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
    overstyringApCodes: PropTypes.arrayOf(PropTypes.string),
  };

  FaktaIndex.defaultProps = {
    overstyringApCodes: [],
    resolveFaktaAksjonspunkter: undefined,
    resolveFaktaOverstyrAksjonspunkter: undefined,
  };

  const mapStateToProps = (state, ownProps) => ({
    shouldOpenDefaultInfoPanels: ownProps.openInfoPanels.length === 1 && ownProps.openInfoPanels.includes(DEFAULT_FAKTA),
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    ...bindActionCreators({
      push,
      resetFakta: ownProps.resetFakta,
      resolveFaktaAksjonspunkter: ownProps.resolveFaktaAksjonspunkter,
      resolveFaktaOverstyrAksjonspunkter: ownProps.resolveFaktaOverstyrAksjonspunkter,
    }, dispatch),
  });

  const TrackRouteParamFaktaIndex = trackRouteParam({
    paramName: 'fakta',
    parse: parseFaktaParam,
    paramPropType: PropTypes.arrayOf(PropTypes.string),
    storeParam: setOpenInfoPanels,
    getParamFromStore: getOpenInfoPanels,
    isQueryParam: true,
    paramsAreEqual,
  })(connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingIdentifier'])(FaktaIndex)));

  return TrackRouteParamFaktaIndex;
};

export default withFaktaIndex;
