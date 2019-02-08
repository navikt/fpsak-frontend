import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import { getBehandlingVersjon } from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import {
  getBehandlingIdentifier,
} from 'behandlingInnsyn/src/duckInnsyn';
import {
  trackRouteParam, requireProps, DEFAULT_FAKTA,
} from '@fpsak-frontend/fp-felles';

import {
  resetFakta, resolveFaktaAksjonspunkter, resolveFaktaOverstyrAksjonspunkter, setOpenInfoPanels, getOpenInfoPanels,
} from './duckFaktaInnsyn';
import FaktaInnsynPanel from './components/FaktaInnsynPanel';

const notEmptyParam = p => p !== null && p !== undefined && p !== '';
const parseFaktaParam = (openInfoPanels = '') => openInfoPanels.split(',').filter(notEmptyParam);
const paramsAreEqual = (a = [], b = []) => ((a.length === b.length) && a.every((param, index) => param === b[index]));

/**
 * FaktaInnsynIndex
 *
 * Container komponent. Har ansvar for faktadelen av hovedvinduet. Definerer funksjoner for henting
 * av data til underkomponentene og lagring av faktaavklaring.
 */
export class FaktaInnsynIndex extends Component {
  componentWillUnmount() {
    const { resetFakta: resetFaktaFn } = this.props;
    resetFaktaFn();
  }

  render() {
    return (
      <FaktaInnsynPanel />
    );
  }
}

FaktaInnsynIndex.propTypes = {
  resetFakta: PropTypes.func.isRequired,
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
    resolveFaktaOverstyrAksjonspunkter,
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
})(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['behandlingIdentifier'])(FaktaInnsynIndex)));
