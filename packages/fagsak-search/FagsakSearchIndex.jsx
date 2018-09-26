import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { pathToFagsak } from 'app/paths';

import fagsakPropType from 'fagsak/fagsakPropType';
import { searchFagsaker, resetFagsakSearch } from './duck';
import {
  getFagsaker,
  getSearchFagsakerAccessDenied,
  getSearchFagsakerFinished,
  getSearchFagsakerStarted,
} from './fagsakSearchSelectors';
import FagsakSearch from './components/FagsakSearch';

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
    const { push } = this.props;
    push(pathToFagsak(saksnummer));
  }

  render() {
    const {
      fagsaker, searchFagsaker: search, searchResultReceived, searchStarted, searchResultAccessDenied,
    } = this.props;
    return (
      <FagsakSearch
        fagsaker={fagsaker}
        searchFagsakCallback={search}
        searchResultReceived={searchResultReceived}
        selectFagsakCallback={(e, saksnummer) => this.goToFagsak(saksnummer)}
        searchStarted={searchStarted}
        searchResultAccessDenied={searchResultAccessDenied}
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
  searchResultReceived: PropTypes.bool.isRequired,
  searchStarted: PropTypes.bool,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
  resetFagsakSearch: PropTypes.func.isRequired,
};

FagsakSearchIndex.defaultProps = {
  fagsaker: [],
  searchStarted: false,
  searchResultAccessDenied: null,
};

const mapStateToProps = state => ({
  searchResultReceived: getSearchFagsakerFinished(state),
  fagsaker: getFagsaker(state),
  searchStarted: getSearchFagsakerStarted(state),
  searchResultAccessDenied: getSearchFagsakerAccessDenied(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...routerActions, searchFagsaker, resetFagsakSearch,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FagsakSearchIndex);
