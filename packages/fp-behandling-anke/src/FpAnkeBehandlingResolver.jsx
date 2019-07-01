import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { isBehandlingInSync } from './selectors/ankeBehandlingSelectors';
import { fetchBehandling as fetchBehandlingActionCreator, getBehandlingIdentifier } from './duckAnke';

export class FpAnkeBehandlingResolver extends Component {
  static propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
    behandlingerVersjonMappedById: PropTypes.shape().isRequired,
    fetchBehandling: PropTypes.func.isRequired,
    isInSync: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.resolveBehandlingInfo();
  }

  resolveBehandlingInfo = () => {
    const {
      isInSync, fetchBehandling, behandlingIdentifier, behandlingerVersjonMappedById,
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

export default connect(mapStateToProps, mapDispatchToProps)(FpAnkeBehandlingResolver);
