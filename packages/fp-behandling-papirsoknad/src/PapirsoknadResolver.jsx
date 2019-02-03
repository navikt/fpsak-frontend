import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-behandling-felles';
import papirsoknadApi from './data/papirsoknadApi';
import { isBehandlingInSync } from './selectors/papirsoknadSelectors';
import { fetchBehandling as fetchBehandlingActionCreator, getBehandlingIdentifier } from './duck';

export class PapirsoknadResolver extends Component {
   static propTypes = {
     behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
     fetchBehandling: PropTypes.func.isRequired,
     behandlingerVersjonMappedById: PropTypes.shape().isRequired,
     isInSync: PropTypes.bool.isRequired,
     children: PropTypes.node.isRequired,
     hasFetchStarted: PropTypes.bool.isRequired,
   };

   static defaultProps = {
     behandlingIdentifier: undefined,
   };

   componentDidUpdate() {
     const {
       isInSync, fetchBehandling, behandlingIdentifier, behandlingerVersjonMappedById, hasFetchStarted,
     } = this.props;
     if (!hasFetchStarted && !isInSync && behandlingIdentifier) {
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
  hasFetchStarted: papirsoknadApi.BEHANDLING.getRestApiStarted()(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchBehandling: fetchBehandlingActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PapirsoknadResolver);
