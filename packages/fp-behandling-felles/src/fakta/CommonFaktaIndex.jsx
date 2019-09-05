import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import {
  BehandlingIdentifier,
  DEFAULT_FAKTA,
  getFaktaLocation,
  getLocationWithDefaultBehandlingspunktAndFakta,
  requireProps,
} from '@fpsak-frontend/fp-felles';

const notEmptyParam = (p) => p !== null && p !== undefined && p !== '';
const notDefaultParam = (p) => p !== DEFAULT_FAKTA;
const formatFaktaParam = (openInfoPanels = []) => openInfoPanels.filter(notEmptyParam).filter(notDefaultParam).join(',');
export const parseFaktaParam = (openInfoPanels = '') => openInfoPanels.split(',').filter(notEmptyParam);
export const paramsAreEqual = (a = [], b = []) => ((a.length === b.length) && a.every((param, index) => param === b[index]));

/**
 * FaktaIndex
 *
 * Container komponent. Har ansvar for faktadelen av hovedvinduet. Definerer funksjoner for henting
 * av data til underkomponentene og lagring av faktaavklaring.
 */
export class CommonFaktaIndex extends Component {
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

    const model = aksjonspunkter.map((ap) => ({
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
      infoPanels = openInfoPanels.filter((infoPanelId) => infoPanelId !== infoPanelToToggleId);
    } else {
      infoPanels = [...openInfoPanels, infoPanelToToggleId];
    }
    this.goToOpenInfoPanels(infoPanels);
  }

  render = () => {
    const { shouldOpenDefaultInfoPanels, render } = this.props;
    return render(this.submitFakta, this.toggleInfoPanel, shouldOpenDefaultInfoPanels);
  }
}

CommonFaktaIndex.propTypes = {
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
  render: PropTypes.func.isRequired,
};

CommonFaktaIndex.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['behandlingIdentifier'])(CommonFaktaIndex));
