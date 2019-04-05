import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import {
  trackRouteParam, requireProps, getFaktaLocation, getLocationWithDefaultBehandlingspunktAndFakta,
  DEFAULT_FAKTA, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';

import { getBehandlingVersjon } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckTilbake';
import {
  resetFakta, resolveFaktaAksjonspunkter, setOpenInfoPanels, getOpenInfoPanels,
} from './duckFaktaTilbake';
import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';

const notEmptyParam = p => p !== null && p !== undefined && p !== '';
const notDefaultParam = p => p !== DEFAULT_FAKTA;
const formatFaktaParam = (openInfoPanels = []) => openInfoPanels.filter(notEmptyParam).filter(notDefaultParam).join(',');
const parseFaktaParam = (openInfoPanels = '') => openInfoPanels.split(',').filter(notEmptyParam);
const paramsAreEqual = (a = [], b = []) => ((a.length === b.length) && a.every((param, index) => param === b[index]));

/**
 * FaktaTilbakeIndex
 *
 * Container komponent. Har ansvar for faktadelen av hovedvinduet. Definerer funksjoner for henting
 * av data til underkomponentene og lagring av faktaavklaring.
 */
export class FaktaTilbakeIndex extends Component {
  constructor() {
    super();

    this.submitFakta = this.submitFakta.bind(this);
    this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToOpenInfoPanels = this.goToOpenInfoPanels.bind(this);
  }

  componentWillUnmount() {
    const { resetFakta: resetFaktaFn } = this.props;
    resetFaktaFn();
  }

  goToBehandlingWithDefaultPunktAndFakta() {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
  }

  goToOpenInfoPanels(infoPanels) {
    const { push: pushLocation, location } = this.props;
    pushLocation(getFaktaLocation(location)(formatFaktaParam(infoPanels)));
  }

  submitFakta(aksjonspunkter) {
    const {
      behandlingIdentifier,
      behandlingVersjon,
      resolveFaktaAksjonspunkter: resolveFaktaAp,
    } = this.props;
    const model = aksjonspunkter.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));

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

  toggleInfoPanel(infoPanelToToggleId) {
    const { openInfoPanels } = this.props;
    let infoPanels;
    if (openInfoPanels.includes(infoPanelToToggleId)) {
      infoPanels = openInfoPanels.filter(infoPanelId => infoPanelId !== infoPanelToToggleId);
    } else {
      infoPanels = [...openInfoPanels, infoPanelToToggleId];
    }
    this.goToOpenInfoPanels(infoPanels);
  }

  render() {
    const { shouldOpenDefaultInfoPanels } = this.props;

    return (
      <TilbakekrevingFaktaPanel
        submitCallback={this.submitFakta}
        toggleInfoPanelCallback={this.toggleInfoPanel}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      />
    );
  }
}

FaktaTilbakeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  resetFakta: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired,
  resolveFaktaAksjonspunkter: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  location: state.router.location,
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  openInfoPanels: getOpenInfoPanels(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    resetFakta,
    resolveFaktaAksjonspunkter,
  }, dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldOpenDefaultInfoPanels: stateProps.openInfoPanels.length === 1 && stateProps.openInfoPanels.includes(DEFAULT_FAKTA),
});

export default trackRouteParam({
  paramName: 'fakta',
  parse: parseFaktaParam,
  paramPropType: PropTypes.arrayOf(PropTypes.string),
  storeParam: setOpenInfoPanels,
  getParamFromStore: getOpenInfoPanels,
  isQueryParam: true,
  paramsAreEqual,
})(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['behandlingIdentifier'])(FaktaTilbakeIndex)));
