import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
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

  render() {
    const {
      fetchFagsakPending, fagsakResolved, children, selectedFagsak,
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

    return children;
  }
}

FagsakResolver.propTypes = {
  selectedSaksnummer: PropTypes.string.isRequired,
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  selectedFagsak: fagsakPropType,
  fetchFagsak: PropTypes.func.isRequired,
  resetFagsakContext: PropTypes.func.isRequired,
  fetchFagsakPending: PropTypes.bool.isRequired,
  fagsakResolved: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

FagsakResolver.defaultProps = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(requireProps(['selectedSaksnummer'], <LoadingPanel />)(FagsakResolver)));
