import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, SettPaVentParams, ReduxFormStateCleaner,
  DataFetcherBehandlingData, BehandlingDataCache, Aksjonspunkt,
} from '@fpsak-frontend/behandling-felles';

import tilbakekrevingApi, { reduxRestApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import TilbakekrevingGrid from './components/TilbakekrevingGrid';
import PerioderForeldelse from './types/perioderForeldelseTsType';
import Beregningsresultat from './types/beregningsresultatTsType';

const tilbakekrevingData = [tilbakekrevingApi.AKSJONSPUNKTER, tilbakekrevingApi.PERIODER_FORELDELSE, tilbakekrevingApi.BEREGNINGSRESULTAT];

interface DataProps {
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  perioderForeldelse: PerioderForeldelse;
  beregningsresultat: Beregningsresultat;
}

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  harApenRevurdering: boolean;
}

interface StateProps {
  behandling?: Behandling;
  kodeverk?: {[key: string]: [Kodeverk]};
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  hentKodeverk: () => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingTilbakekrevingIndex extends PureComponent<Props> {
  behandlingDataCache: BehandlingDataCache = new BehandlingDataCache()

  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId, hentKodeverk,
    } = this.props;
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params, { keepData: true }),
      henleggBehandling: (params) => henleggBehandling(params),
    });

    this.behandlingDataCache = new BehandlingDataCache();
    hentBehandling({ behandlingId }, { keepData: false });
    hentKodeverk();
  }

  componentWillUnmount = () => {
    const {
      behandlingEventHandler, resetRestApiContext, destroyReduxForm, behandling,
    } = this.props;
    behandlingEventHandler.clear();
    resetRestApiContext();
    setTimeout(() => destroyReduxForm(getBehandlingFormPrefix(behandling.id, behandling.versjon)), 1000);
  }

  render() {
    const {
      behandling,
      oppdaterBehandlingVersjon,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegIUrl,
      valgtProsessSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      harApenRevurdering,
      hasFetchError,
    } = this.props;

    if (!behandling || !kodeverk) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    if (this.behandlingDataCache.getCurrentVersion() !== behandling.versjon) {
      this.behandlingDataCache.setVersion(behandling.versjon);
      this.behandlingDataCache.setData(behandling.versjon, 'behandling', behandling);
    }

    return (
      <DataFetcherBehandlingData
        behandlingDataCache={this.behandlingDataCache}
        behandlingVersion={behandling.versjon}
        endpoints={tilbakekrevingData}
        showOldDataWhenRefetching
        render={(dataProps: DataProps) => (
          <>
            <ReduxFormStateCleaner behandlingId={dataProps.behandling.id} behandlingVersjon={dataProps.behandling.versjon} />
            <TilbakekrevingGrid
              fagsak={fagsak}
              kodeverk={kodeverk}
              navAnsatt={navAnsatt}
              valgtProsessSteg={valgtProsessSteg}
              oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
              oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              opneSokeside={opneSokeside}
              harApenRevurdering={harApenRevurdering}
              hasFetchError={hasFetchError}
              {...dataProps}
            />
          </>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiData()(state),
  kodeverk: tilbakekrevingApi.TILBAKE_KODEVERK.getRestApiData()(state),
  hasFetchError: !!tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch) => {
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
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingTilbakekrevingIndex);
