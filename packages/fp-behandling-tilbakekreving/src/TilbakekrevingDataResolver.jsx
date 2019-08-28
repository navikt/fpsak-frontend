import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import tilbakekrevingBehandlingApi from './data/tilbakekrevingBehandlingApi';

export class TilbakekrevingDataResolver extends Component {
  static propTypes = {
    fetchKodeverk: PropTypes.func.isRequired,
    isInSync: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.resolveTilbakekrevingData();
  }

  resolveTilbakekrevingData = () => {
    const { fetchKodeverk } = this.props;
    fetchKodeverk();
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
    isInSync: blockers.every((finished) => finished),
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchKodeverk: tilbakekrevingBehandlingApi.TILBAKE_KODEVERK.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TilbakekrevingDataResolver);
