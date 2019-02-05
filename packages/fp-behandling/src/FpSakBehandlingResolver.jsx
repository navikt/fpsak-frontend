import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-behandling-felles';
import { isBehandlingInSync } from './behandlingSelectors';
import { fetchBehandling as fetchBehandlingActionCreator, getBehandlingIdentifier } from './duck';

export class FpSakBehandlingResolver extends Component {
  static propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
    fetchBehandling: PropTypes.func.isRequired,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    isInSync: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.resolveBehandlingInfo();
  }

  resolveBehandlingInfo = () => {
    const {
      isInSync, fetchBehandling, behandlingerVersjonMappedById, behandlingIdentifier,
    } = this.props;
    if (!isInSync) {
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

const mapStateToProps = state => ({
  isInSync: isBehandlingInSync(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FpSakBehandlingResolver);
