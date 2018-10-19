import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LoadingPanel from 'sharedComponents/LoadingPanel';
import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { getSelectedBehandlingIdentifier, isBehandlingInSync } from './behandlingSelectors';
import { getBehandlingerVersjonMappedById } from './selectors/behandlingerSelectors';
import { fetchBehandling as fetchBehandlingActionCreator } from './duck';

export class BehandlingResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveBehandlingInfo = this.resolveBehandlingInfo.bind(this);

    this.resolveBehandlingInfo();
  }

  resolveBehandlingInfo() {
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

BehandlingResolver.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  fetchBehandling: PropTypes.func.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
  isInSync: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  behandlingerVersjonMappedById: getBehandlingerVersjonMappedById(state),
  isInSync: isBehandlingInSync(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingResolver);
