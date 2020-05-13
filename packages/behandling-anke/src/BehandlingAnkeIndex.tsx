import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, Rettigheter, DataFetcherBehandlingData, DataFetcherTriggers, SettPaVentParams, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

import ankeApi, { reduxRestApi, AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';
import AnkePaneler from './components/AnkePaneler';
import FetchedData from './types/fetchedDataTsType';

const ankeData = [ankeApi.AKSJONSPUNKTER, ankeApi.VILKAR, ankeApi.ANKE_VURDERING];

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  rettigheter: Rettigheter;
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
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
  forrigeBehandling?: Behandling;
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
      forrigeBehandling,
      oppdaterBehandlingVersjon,
      fagsak,
      rettigheter,
      kodeverk,
      oppdaterProsessStegOgFaktaPanelIUrl,
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

    return (
      <DataFetcherBehandlingData
        fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
        endpoints={ankeData}
        showOldDataWhenRefetching
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <AnkePaneler
              behandling={isFinished ? behandling : forrigeBehandling}
              fetchedData={dataProps}
              fagsak={fagsak}
              rettigheter={rettigheter}
              alleKodeverk={kodeverk}
              valgtProsessSteg={valgtProsessSteg}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
              oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              opneSokeside={opneSokeside}
              alleBehandlinger={alleBehandlinger}
            />
          </>
        )}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: ankeApi.BEHANDLING_ANKE.getRestApiData()(state),
  forrigeBehandling: ankeApi.BEHANDLING_ANKE.getRestApiPreviousData()(state),
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
