import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import {
  getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling, pathToBehandlinger, pathToMissingPage,
} from 'app/paths';
import { getBehandlingerIds } from 'behandling/selectors/behandlingerSelectors';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import requireProps from 'app/data/requireProps';
import { resetFagsakSearch as resetFagsakSearchActionCreator } from 'fagsakSearch/duck';
import { removeErrorMessage } from 'app/duck';
import { resetFagsakContext as resetFagsakContextActionCreator, fetchFagsakInfo as fetchFagsakInfoActionCreator } from './duck';
import {
  getSelectedSaksnummer, getFetchFagsakInfoFinished, getFetchFagsakInfoFailed, getAllFagsakInfoResolved, getSelectedFagsak,
}
  from './fagsakSelectors';
import fagsakPropType from './fagsakPropType';

/**
 * FagsakResolver
 *
 * Container-komponent. Har ansvar for å hente info om fagsak med et gitt saksnummer fra serveren.
 * NB: Komponenten henter kun fagsak når den konstrueres. Bruk unik key.
 */
export class FagsakResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveFagsakInfo = this.resolveFagsakInfo.bind(this);
    this.pathToBehandling = this.pathToBehandling.bind(this);

    this.resolveFagsakInfo();
  }

  componentWillUnmount() {
    const { resetFagsakContext, resetFagsakSearch, removeErrorMessage: removeErrorMsg } = this.props;
    resetFagsakContext();
    resetFagsakSearch();
    removeErrorMsg();
  }

  resolveFagsakInfo() {
    const { selectedSaksnummer, fetchFagsakInfo } = this.props;
    fetchFagsakInfo(selectedSaksnummer);
  }

  pathToBehandling() {
    const { selectedSaksnummer, behandlingerIds, location } = this.props;
    if (behandlingerIds.length === 1) {
      return getLocationWithDefaultBehandlingspunktAndFakta({ ...location, pathname: pathToBehandling(selectedSaksnummer, behandlingerIds[0]) });
    }
    return pathToBehandlinger(selectedSaksnummer);
  }

  render() {
    const {
      fetchFagsakInfoPending, allFagsakInfoResolved, shouldRedirectToBehandlinger, children, selectedFagsak,
    } = this.props;
    if (!allFagsakInfoResolved) {
      if (fetchFagsakInfoPending) {
        return <LoadingPanel />;
      }
      return <Redirect to={pathToMissingPage()} />;
    }
    if (!selectedFagsak) {
      return <Redirect to={pathToMissingPage()} />;
    }
    if (shouldRedirectToBehandlinger) {
      return <Redirect to={this.pathToBehandling()} />;
    }
    return children;
  }
}

FagsakResolver.propTypes = {
  selectedSaksnummer: PropTypes.number.isRequired,
  selectedFagsak: fagsakPropType,
  behandlingerIds: PropTypes.arrayOf(PropTypes.number),
  fetchFagsakInfo: PropTypes.func.isRequired,
  resetFagsakContext: PropTypes.func.isRequired,
  resetFagsakSearch: PropTypes.func.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  fetchFagsakInfoPending: PropTypes.bool.isRequired,
  allFagsakInfoResolved: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  shouldRedirectToBehandlinger: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

FagsakResolver.defaultProps = {
  behandlingerIds: [],
  selectedFagsak: null,
  children: null,
};

const mapStateToProps = state => ({
  selectedSaksnummer: getSelectedSaksnummer(state),
  selectedFagsak: getSelectedFagsak(state),
  behandlingerIds: getBehandlingerIds(state),
  fetchFagsakInfoPending: !getFetchFagsakInfoFinished(state) || !getFetchFagsakInfoFailed(state),
  allFagsakInfoResolved: getAllFagsakInfoResolved(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchFagsakInfo: fetchFagsakInfoActionCreator,
  resetFagsakContext: resetFagsakContextActionCreator,
  resetFagsakSearch: resetFagsakSearchActionCreator,
  removeErrorMessage,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['selectedSaksnummer'], <LoadingPanel />)(FagsakResolver)));
