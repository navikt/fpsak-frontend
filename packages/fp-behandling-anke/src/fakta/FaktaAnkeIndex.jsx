import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';

import {
  trackRouteParam, requireProps, DEFAULT_FAKTA,
} from '@fpsak-frontend/fp-felles';

import { getBehandlingVersjon } from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingAnke/src/duckAnke';
import {
  resetFakta, resolveFaktaAksjonspunkter, setOpenInfoPanels, getOpenInfoPanels,
} from './duckFaktaAnke';
import FaktaAnkePanel from './components/FaktaAnkePanel';

const notEmptyParam = p => p !== null && p !== undefined && p !== '';
const parseFaktaParam = (openInfoPanels = '') => openInfoPanels.split(',').filter(notEmptyParam);
const paramsAreEqual = (a = [], b = []) => ((a.length === b.length) && a.every((param, index) => param === b[index]));

/**
 * FaktaAnkeIndex
 *
 * Container komponent. Har ansvar for faktadelen av hovedvinduet. Definerer funksjoner for henting
 * av data til underkomponentene og lagring av faktaavklaring.
 */
export class FaktaAnkeIndex extends Component {
  componentWillUnmount() {
    const { resetFakta: resetFaktaFn } = this.props;
    resetFaktaFn();
  }

  render() {
    return (
      <FaktaAnkePanel />
    );
  }
}

FaktaAnkeIndex.propTypes = {
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
})(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['behandlingIdentifier'])(FaktaAnkeIndex)));
