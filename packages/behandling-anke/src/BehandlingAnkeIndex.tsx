import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, DataFetcherBehandlingData, SettPaVentParams, ReduxFormStateCleaner, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';
import {
  Behandling, Kodeverk, NavAnsatt, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';

import ankeApi, { reduxRestApi, AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';
import AnkeGrid from './components/AnkeGrid';
import AnkeVurdering from './types/ankeVurderingTsType';

const ankeData = [ankeApi.AKSJONSPUNKTER, ankeApi.VILKAR, ankeApi.ANKE_VURDERING];

interface DataProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
}

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  kodeverk: {[key: string]: Kodeverk[]};
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  alleBehandlinger: {
    id: number;
    type: Kodeverk;
    avsluttet?: string;
  }[];
}

interface StateProps {
  behandling?: Behandling;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingAnkeIndex extends PureComponent<Props> {
  behandlingDataCache: BehandlingDataCache = new BehandlingDataCache()

  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId,
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
      fagsak,
      navAnsatt,
      kodeverk,
      oppdaterProsessStegIUrl,
      valgtProsessSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      alleBehandlinger,
    } = this.props;

    if (!behandling) {
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
        endpoints={ankeData}
        showOldDataWhenRefetching
        render={(dataProps: DataProps) => (
          <>
            <ReduxFormStateCleaner behandlingId={dataProps.behandling.id} behandlingVersjon={dataProps.behandling.versjon} />
            <AnkeGrid
              fagsak={fagsak}
              navAnsatt={navAnsatt}
              kodeverk={kodeverk}
              valgtProsessSteg={valgtProsessSteg}
              oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
              oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              opneSokeside={opneSokeside}
              alleBehandlinger={alleBehandlinger}
              {...dataProps}
            />
          </>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: ankeApi.BEHANDLING_ANKE.getRestApiData()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(AnkeBehandlingApiKeys)
    .forEach((value) => {
      dispatch(ankeApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: ankeApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: ankeApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: ankeApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: ankeApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: ankeApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: ankeApi.BEHANDLING_ANKE.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingAnkeIndex);
