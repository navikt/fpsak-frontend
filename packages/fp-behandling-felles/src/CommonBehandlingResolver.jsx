import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

class CommonBehandlingResolver extends Component {
  static propTypes = {
    behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
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
      isInSync, fetchBehandling, behandlingIdentifier,
    } = this.props;
    if (!isInSync) {
      fetchBehandling(behandlingIdentifier);
    }
  }

  render() {
    const { isInSync, children } = this.props;
    return isInSync
      ? children
      : <LoadingPanel />;
  }
}

export default CommonBehandlingResolver;
