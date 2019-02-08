import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { isBehandlingInSync } from './selectors/papirsoknadSelectors';
import { fetchBehandling as fetchBehandlingActionCreator, getBehandlingIdentifier } from './duck';

export class PapirsoknadResolver extends Component {
   static propTypes = {
     behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
     fetchBehandling: PropTypes.func.isRequired,
     behandlingerVersjonMappedById: PropTypes.shape().isRequired,
     isInSync: PropTypes.bool.isRequired,
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
      isInSync, fetchBehandling, behandlingerVersjonMappedById, behandlingIdentifier,
    } = this.props;
    if (!isInSync) {
      fetchBehandling(behandlingIdentifier, behandlingerVersjonMappedById);
    }
  }

  render = () => {
    const { isInSync, children } = this.props;
    return isInSync
      ? children
      : <LoadingPanel />;
  }
}

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  isInSync: isBehandlingInSync(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PapirsoknadResolver);
