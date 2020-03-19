import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';

import {
  errorOfType, ErrorTypes, getErrorResponseData,
} from '@fpsak-frontend/rest-api';
import { fagsakPropType } from '@fpsak-frontend/prop-types';
import FagsakSokSakIndex from '@fpsak-frontend/sak-sok';

import { pathToFagsak } from '../app/paths';
import fpsakApi from '../data/fpsakApi';
import { getAlleFpSakKodeverk } from '../kodeverk/duck';

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */
class FagsakSearchIndex extends Component {
  constructor() {
    super();
    this.goToFagsak = this.goToFagsak.bind(this);
  }

  componentDidUpdate() {
    const { searchResultReceived, fagsaker } = this.props;
    if (searchResultReceived && fagsaker.length === 1) {
      this.goToFagsak(fagsaker[0].saksnummer);
    }
  }

  componentWillUnmount() {
    const { resetFagsakSearch: resetSearch } = this.props;
    resetSearch();
  }

  goToFagsak(saksnummer) {
    const { push: pushLocation } = this.props;
    pushLocation(pathToFagsak(saksnummer));
  }

  render() {
    const {
      fagsaker, searchFagsaker: search, searchResultReceived, searchStarted, searchResultAccessDenied, alleKodeverk,
    } = this.props;
    return (
      <FagsakSokSakIndex
        fagsaker={fagsaker}
        searchFagsakCallback={search}
        searchResultReceived={searchResultReceived}
        selectFagsakCallback={(e, saksnummer) => this.goToFagsak(saksnummer)}
        searchStarted={searchStarted}
        searchResultAccessDenied={searchResultAccessDenied}
        alleKodeverk={alleKodeverk}
      />
    );
  }
}

FagsakSearchIndex.propTypes = {
  /**
   * Saksnummer eller fødselsnummer/D-nummer
   */
  fagsaker: PropTypes.arrayOf(fagsakPropType),
  push: PropTypes.func.isRequired,
  searchFagsaker: PropTypes.func.isRequired,
  searchResultReceived: PropTypes.bool,
  searchStarted: PropTypes.bool,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
  resetFagsakSearch: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

FagsakSearchIndex.defaultProps = {
  fagsaker: [],
  searchStarted: false,
  searchResultAccessDenied: null,
  searchResultReceived: false,
};

export const getSearchFagsakerAccessDenied = createSelector(
  [fpsakApi.SEARCH_FAGSAK.getRestApiError()],
  (error) => {
    if (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)) {
      return getErrorResponseData(error);
    }
    return undefined;
  },
);

const mapStateToProps = (state) => ({
  searchResultReceived: fpsakApi.SEARCH_FAGSAK.getRestApiFinished()(state),
  fagsaker: fpsakApi.SEARCH_FAGSAK.getRestApiData()(state),
  searchStarted: fpsakApi.SEARCH_FAGSAK.getRestApiStarted()(state),
  searchResultAccessDenied: getSearchFagsakerAccessDenied(state),
  alleKodeverk: getAlleFpSakKodeverk(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    searchFagsaker: fpsakApi.SEARCH_FAGSAK.makeRestApiRequest(),
    resetFagsakSearch: fpsakApi.SEARCH_FAGSAK.resetRestApi(),
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
