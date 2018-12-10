import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';

import BehandlingGrid from 'behandlingFelles/components/BehandlingGrid';
import BehandlingsprosessIndex from './behandlingsprosess/BehandlingsprosessIndex';
import FaktaIndex from './fakta/FaktaIndex';
import BehandlingResolver from './BehandlingResolver';
import { getBehandlingFormPrefix } from './behandlingForm';
import {
  setBehandlingInfo, getBehandlingIdentifier, resetTilbakekrevingContext,
} from './duck';

/**
 * BehandlingIndex
 *
 * Container-komponent. Er rot for for den delen av hovedvinduet som har innhold for en valgt behandling, og styrer livssyklusen til de mekanismene som er
 * relatert til den valgte behandlingen.
 *
 * Komponenten har ansvar å legge valgt behandlingId fra URL-en i staten.
 */
export class BehandlingIndex extends Component {
  constructor() {
    super();
    this.didGetNewBehandlingVersion = this.didGetNewBehandlingVersion.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }

  componentWillMount() {
    const {
      setBehandlingInfo: setInfo, saksnummer, behandlingId,
    } = this.props;
    setInfo({ behandlingId, fagsakSaksnummer: saksnummer });
  }

  componentDidUpdate(prevProps) {
    if (this.didGetNewBehandlingVersion(prevProps)) {
      this.cleanUp(prevProps.behandlingId, prevProps.behandlingVersjon);
    }
  }

  componentWillUnmount() {
    const { behandlingId, behandlingVersjon } = this.props;
    this.cleanUp(behandlingId, behandlingVersjon);
  }

  didGetNewBehandlingVersion(prevProps) {
    const { behandlingVersjon } = this.props;
    return prevProps.behandlingVersjon !== behandlingVersjon;
  }

  cleanUp(behandlingId, behandlingVersjon) {
    const { destroyReduxForms: destroyForms, resetTilbakekrevingContext: resetContext } = this.props;
    resetContext();
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    setTimeout(() => destroyForms(behandlingFormPrefix), 1000); // Delay destruction to after potentially expensive transition
  }

  render() {
    const {
      updateFagsakInfo,
      behandlingerVersjonMappedById,
      behandlingIdentifier,
    } = this.props;

    if (!behandlingIdentifier) {
      return null;
    }

    return (
      <BehandlingResolver behandlingerVersjonMappedById={behandlingerVersjonMappedById}>
        <BehandlingGrid
          behandlingsprosessContent={<BehandlingsprosessIndex updateFagsakInfo={updateFagsakInfo} />}
          faktaContent={<FaktaIndex updateFagsakInfo={updateFagsakInfo} />}
        />
      </BehandlingResolver>
    );
  }
}

BehandlingIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  destroyReduxForms: PropTypes.func.isRequired,
  setBehandlingInfo: PropTypes.func.isRequired,
  updateFagsakInfo: PropTypes.func.isRequired,
  resetTilbakekrevingContext: PropTypes.func.isRequired,
  behandlingerVersjonMappedById: PropTypes.shape().isRequired,
  behandlingIdentifier: PropTypes.shape(),
};

BehandlingIndex.defaultProps = {
  behandlingIdentifier: undefined,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setBehandlingInfo,
  resetTilbakekrevingContext,
  destroyReduxForms: destroy,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingIndex);
