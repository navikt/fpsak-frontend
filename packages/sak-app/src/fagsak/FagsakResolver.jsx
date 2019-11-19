import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  getLocationWithDefaultBehandlingspunktAndFakta,
  pathToBehandling,
  pathToBehandlinger,
  pathToMissingPage,
  requireProps,
} from '@fpsak-frontend/fp-felles';
import { fagsakPropType } from '@fpsak-frontend/prop-types';

import fpsakApi from '../data/fpsakApi';
import { getBehandlingerIds } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import { resetFagsakContext as resetFagsakContextActionCreator } from './duck';
import {
  getSelectedFagsak, getSelectedSaksnummer,
} from './fagsakSelectors';

/**
 * FagsakResolver
 *
 * Container-komponent. Har ansvar for å hente info om fagsak med et gitt saksnummer fra serveren.
 * NB: Komponenten henter kun fagsak når den konstrueres. Bruk unik key.
 */
export class FagsakResolver extends Component {
  constructor(props) {
    super(props);
    this.resolveFagsak = this.resolveFagsak.bind(this);
    this.pathToBehandling = this.pathToBehandling.bind(this);
  }

  componentWillUnmount() {
    const { resetFagsakContext } = this.props;
    resetFagsakContext();
  }

  componentDidMount = () => {
    this.resolveFagsak();
  }

  componentDidUpdate = (prevProps) => {
    const {
      behandlingId, behandlingVersjon,
    } = this.props;
    const hasBehandlingIdChanged = prevProps.behandlingId && prevProps.behandlingId !== behandlingId;
    const hasBehandlingVersjonChanged = prevProps.behandlingVersjon && prevProps.behandlingVersjon !== behandlingVersjon;
    if (hasBehandlingIdChanged || hasBehandlingVersjonChanged) {
      this.resolveFagsak();
    }
  }

  resolveFagsak() {
    const {
      selectedSaksnummer, fetchFagsak,
    } = this.props;

    fetchFagsak({ saksnummer: selectedSaksnummer }, { keepData: true });
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
      fetchFagsakPending, fagsakResolved, shouldRedirectToBehandlinger, children, selectedFagsak,
    } = this.props;
    if (!fagsakResolved) {
      if (fetchFagsakPending) {
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
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  selectedFagsak: fagsakPropType,
  behandlingerIds: PropTypes.arrayOf(PropTypes.number),
  fetchFagsak: PropTypes.func.isRequired,
  resetFagsakContext: PropTypes.func.isRequired,
  fetchFagsakPending: PropTypes.bool.isRequired,
  fagsakResolved: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  shouldRedirectToBehandlinger: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

FagsakResolver.defaultProps = {
  behandlingerIds: [],
  selectedFagsak: null,
  children: null,
  behandlingId: undefined,
  behandlingVersjon: undefined,
};

const mapStateToProps = (state) => ({
  selectedSaksnummer: getSelectedSaksnummer(state),
  selectedFagsak: getSelectedFagsak(state),
  behandlingerIds: getBehandlingerIds(state),
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
  fetchFagsakPending: !fpsakApi.FETCH_FAGSAK.getRestApiFinished()(state) || !fpsakApi.FETCH_FAGSAK.getRestApiError()(state),
  fagsakResolved: !!fpsakApi.FETCH_FAGSAK.getRestApiData()(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchFagsak: fpsakApi.FETCH_FAGSAK.makeRestApiRequest(),
  resetFagsakContext: resetFagsakContextActionCreator,
}, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  shouldRedirectToBehandlinger: ownProps.match.isExact,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(requireProps(['selectedSaksnummer'], <LoadingPanel />)(FagsakResolver)));
