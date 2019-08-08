import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi from './data/tilbakekrevingBehandlingApi';
import { isBehandlingInSync } from './selectors/tilbakekrevingBehandlingSelectors';
import { fetchBehandling as fetchBehandlingActionCreator, getBehandlingIdentifier } from './duckTilbake';

export class FpTilbakeBehandlingResolver extends Component {
  static propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
    fetchBehandling: PropTypes.func.isRequired,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    isInSync: PropTypes.bool.isRequired,
    fetchKodeverk: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  static defaultProps = {
    behandlingIdentifier: undefined,
  };

  constructor(props) {
    super(props);
    this.resolveBehandlingInfo();
  }

  resolveBehandlingInfo = () => {
    const {
      isInSync, fetchBehandling, behandlingerVersjonMappedById, behandlingIdentifier, fetchKodeverk,
    } = this.props;

    if (!isInSync) {
      fetchKodeverk();
      fetchBehandling(behandlingIdentifier, behandlingerVersjonMappedById);
    }
  }

  render() {
    const { isInSync, children } = this.props;
    return isInSync
      ? children
      : <LoadingPanel />;
  }
}

const mapStateToProps = (state) => {
  const blockers = [
    tilbakekrevingBehandlingApi.TILBAKE_KODEVERK.getRestApiFinished()(state),
  ];

  return {
    behandlingIdentifier: getBehandlingIdentifier(state),
    isInSync: isBehandlingInSync(state) && blockers.every(finished => finished),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
  fetchKodeverk: tilbakekrevingBehandlingApi.TILBAKE_KODEVERK.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FpTilbakeBehandlingResolver);
