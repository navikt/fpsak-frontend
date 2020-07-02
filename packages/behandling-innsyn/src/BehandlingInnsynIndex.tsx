import React, {
  FunctionComponent, useEffect, useRef,
} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import {
  FagsakInfo, Rettigheter, SettPaVentParams, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, KodeverkMedNavn } from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import innsynApi, { reduxRestApi, InnsynBehandlingApiKeys } from './data/innsynBehandlingApi';
import InnsynPaneler from './components/InnsynPaneler';
import FetchedData from './types/fetchedDataTsType';

const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN, innsynApi.INNSYN_DOKUMENTER];

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: any) => Promise<void>;
  settBehandlingPaVent: (params: any) => Promise<void>;
  taBehandlingAvVent: (params: any, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: any) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const BehandlingInnsynIndex: FunctionComponent<Props> = ({
  behandlingEventHandler,
  nyBehandlendeEnhet,
  settBehandlingPaVent,
  taBehandlingAvVent,
  henleggBehandling,
  hentBehandling,
  behandlingId,
  resetRestApiContext,
  destroyReduxForm,
  behandling,
  oppdaterBehandlingVersjon,
  kodeverk,
  fagsak,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  settPaVent,
  opneSokeside,
  forrigeBehandling,
}) => {
  const forrigeVersjon = useRef<number>();

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => hentBehandling({ behandlingId }, { keepData: true })),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params, { keepData: true }),
      henleggBehandling: (params) => henleggBehandling(params),
    });

    hentBehandling({ behandlingId }, { keepData: false });

    return () => {
      behandlingEventHandler.clear();
      resetRestApiContext();
      setTimeout(() => {
        destroyReduxForm(getBehandlingFormPrefix(behandlingId, forrigeVersjon.current));
      }, 1000);
    };
  }, [behandlingId]);

  if (!behandling) {
    return <LoadingPanel />;
  }

  forrigeVersjon.current = behandling.versjon;

  reduxRestApi.injectPaths(behandling.links);

  return (
    <DataFetcher
      fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
      showOldDataWhenRefetching
      endpoints={innsynData}
      endpointParams={{ [innsynApi.INNSYN_DOKUMENTER.name]: { saksnummer: fagsak.saksnummer } }}
      loadingPanel={<LoadingPanel />}
      render={(dataProps: FetchedData, isFinished) => (
        <>
          <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
          <InnsynPaneler
            behandling={isFinished ? behandling : forrigeBehandling}
            fetchedData={dataProps}
            fagsak={fagsak}
            kodeverk={kodeverk}
            rettigheter={rettigheter}
            valgtProsessSteg={valgtProsessSteg}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
            settPaVent={settPaVent}
            hentBehandling={hentBehandling}
            opneSokeside={opneSokeside}
          />
        </>
      )}
    />
  );
};

const mapStateToProps = (state) => ({
  behandling: innsynApi.BEHANDLING_INNSYN.getRestApiData()(state),
  forrigeBehandling: innsynApi.BEHANDLING_INNSYN.getRestApiPreviousData()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(InnsynBehandlingApiKeys)
    .forEach((value) => {
      dispatch(innsynApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: innsynApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: innsynApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: innsynApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: innsynApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: innsynApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: innsynApi.BEHANDLING_INNSYN.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingInnsynIndex);
