import React, { Component, ReactNode } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import { Fagsak } from '@fpsak-frontend/types';

import { pathToMissingPage } from '../app/paths';
import fpsakApi from '../data/fpsakApi';
import { getBehandlingerIds } from '../behandling/selectors/behandlingerSelectors';
import { getSelectedBehandlingId, getBehandlingVersjon } from '../behandling/duck';
import { resetFagsakContext as resetFagsakContextActionCreator } from './duck';
import {
  getSelectedFagsak, getSelectedSaksnummer,
} from './fagsakSelectors';

interface OwnProps {
  selectedSaksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  selectedFagsak?: Fagsak;
  fetchFagsak: (params: { saksnummer: number }, options: { keepData: boolean }) => void;
  resetFagsakContext: () => void;
  fetchFagsakPending: boolean;
  fagsakResolved: boolean;
  children?: ReactNode;
}

/**
 * FagsakResolver
 *
 * Container-komponent. Har ansvar for å hente info om fagsak med et gitt saksnummer fra serveren.
 * NB: Komponenten henter kun fagsak når den konstrueres. Bruk unik key.
 */
export class FagsakResolver extends Component<OwnProps> {
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
