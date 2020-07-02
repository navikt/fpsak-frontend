import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import {
  FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, Rettigheter,
} from '@fpsak-frontend/behandling-felles';
import { KodeverkMedNavn, Behandling } from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import tilbakekrevingApi, { reduxRestApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import TilbakekrevingPaneler from './components/TilbakekrevingPaneler';
import FetchedData from './types/fetchedDataTsType';

const tilbakekrevingData = [tilbakekrevingApi.AKSJONSPUNKTER, tilbakekrevingApi.FEILUTBETALING_FAKTA,
  tilbakekrevingApi.PERIODER_FORELDELSE, tilbakekrevingApi.BEREGNINGSRESULTAT];

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  kodeverk: {[key: string]: KodeverkMedNavn[]};
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  tilbakekrevingKodeverk?: {[key: string]: KodeverkMedNavn[]};
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: any) => Promise<void>;
  settBehandlingPaVent: (params: any) => Promise<void>;
  taBehandlingAvVent: (params: any, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: any) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  hentKodeverk: () => Promise<any>;
  opprettVerge: (params: any) => Promise<any>;
  fjernVerge: (params: any) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingTilbakekrevingIndex extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId, hentKodeverk,
      opprettVerge, fjernVerge,
    } = this.props;
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params, { keepData: true }),
      henleggBehandling: (params) => henleggBehandling(params),
      opprettVerge: (params) => opprettVerge(params),
      fjernVerge: (params) => fjernVerge(params),
    });

    hentBehandling({ behandlingId }, { keepData: false });
    hentKodeverk();
  };

  componentWillUnmount = () => {
    const {
      behandlingEventHandler, resetRestApiContext, destroyReduxForm, behandling,
    } = this.props;
    behandlingEventHandler.clear();
    resetRestApiContext();
    setTimeout(() => destroyReduxForm(getBehandlingFormPrefix(behandling.id, behandling.versjon)), 1000);
  };

  render() {
    const {
      behandling,
      forrigeBehandling,
      oppdaterBehandlingVersjon,
      kodeverk: fpsakKodeverk,
      tilbakekrevingKodeverk,
      fagsak,
      rettigheter,
      oppdaterProsessStegOgFaktaPanelIUrl,
      valgtProsessSteg,
      valgtFaktaSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      harApenRevurdering,
      hasFetchError,
    } = this.props;

    if (!behandling || !tilbakekrevingKodeverk) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
        endpoints={tilbakekrevingData}
        showOldDataWhenRefetching
        loadingPanel={<LoadingPanel />}
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <TilbakekrevingPaneler
              behandling={isFinished ? behandling : forrigeBehandling}
              fetchedData={dataProps}
              fagsak={fagsak}
              kodeverk={tilbakekrevingKodeverk}
              fpsakKodeverk={fpsakKodeverk}
              rettigheter={rettigheter}
              valgtProsessSteg={valgtProsessSteg}
              valgtFaktaSteg={valgtFaktaSteg}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              opneSokeside={opneSokeside}
              harApenRevurdering={harApenRevurdering}
              hasFetchError={hasFetchError}
            />
          </>
        )}
      />
    );
  }
}

const mapStateToProps = (state): StateProps => ({
  behandling: tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiData()(state),
  forrigeBehandling: tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiPreviousData()(state),
  tilbakekrevingKodeverk: tilbakekrevingApi.TILBAKE_KODEVERK.getRestApiData()(state),
  hasFetchError: !!tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch: Dispatch) => {
  Object.values(TilbakekrevingBehandlingApiKeys)
    .forEach((value) => {
      dispatch(tilbakekrevingApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: tilbakekrevingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: tilbakekrevingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: tilbakekrevingApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: tilbakekrevingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: tilbakekrevingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: tilbakekrevingApi.BEHANDLING_TILBAKE.makeRestApiRequest(),
    hentKodeverk: tilbakekrevingApi.TILBAKE_KODEVERK.makeRestApiRequest(),
    opprettVerge: tilbakekrevingApi.VERGE_OPPRETT.makeRestApiRequest(),
    fjernVerge: tilbakekrevingApi.VERGE_FJERN.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingTilbakekrevingIndex);
