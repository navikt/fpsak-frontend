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

import fpBehandlingApi, { reduxRestApi, FpBehandlingApiKeys } from './data/fpBehandlingApi';
import ForeldrepengerPaneler from './components/ForeldrepengerPaneler';
import FetchedData from './types/fetchedDataTsType';

const foreldrepengerData = [fpBehandlingApi.AKSJONSPUNKTER, fpBehandlingApi.VILKAR, fpBehandlingApi.PERSONOPPLYSNINGER, fpBehandlingApi.YTELSEFORDELING,
  fpBehandlingApi.SOKNAD, fpBehandlingApi.INNTEKT_ARBEID_YTELSE, fpBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER, fpBehandlingApi.BEREGNINGSGRUNNLAG,
  fpBehandlingApi.UTTAK_STONADSKONTOER, fpBehandlingApi.UTTAKSRESULTAT_PERIODER, fpBehandlingApi.SIMULERING_RESULTAT];

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
  featureToggles: any;
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  kodeverk?: {[key: string]: KodeverkMedNavn[]};
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: any) => Promise<void>;
  settBehandlingPaVent: (params: any) => Promise<void>;
  taBehandlingAvVent: (params: any, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: any) => Promise<void>;
  opneBehandlingForEndringer: (params: any) => Promise<any>;
  opprettVerge: (params: any) => Promise<any>;
  fjernVerge: (params: any) => Promise<any>;
  lagreRisikoklassifiseringAksjonspunkt: (params: any) => Promise<any>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const BehandlingForeldrepengerIndex: FunctionComponent<Props> = ({
  opneBehandlingForEndringer,
  opprettVerge,
  fjernVerge,
  lagreRisikoklassifiseringAksjonspunkt,
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
  valgtFaktaSteg,
  settPaVent,
  opneSokeside,
  forrigeBehandling,
  hasFetchError,
  featureToggles,
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
      opneBehandlingForEndringer: (params) => opneBehandlingForEndringer(params),
      opprettVerge: (params) => opprettVerge(params),
      fjernVerge: (params) => fjernVerge(params),
      lagreRisikoklassifiseringAksjonspunkt: (params) => lagreRisikoklassifiseringAksjonspunkt(params),
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
      endpoints={foreldrepengerData}
      showOldDataWhenRefetching
      loadingPanel={<LoadingPanel />}
      render={(dataProps: FetchedData, isFinished) => (
        <>
          <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
          <ForeldrepengerPaneler
            behandling={isFinished ? behandling : forrigeBehandling}
            fetchedData={dataProps}
            fagsak={fagsak}
            alleKodeverk={kodeverk}
            rettigheter={rettigheter}
            valgtProsessSteg={valgtProsessSteg}
            oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
            valgtFaktaSteg={valgtFaktaSteg}
            oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
            settPaVent={settPaVent}
            hentBehandling={hentBehandling}
            opneSokeside={opneSokeside}
            hasFetchError={hasFetchError}
            featureToggles={featureToggles}
          />
        </>
      )}
    />
  );
};

const mapStateToProps = (state): StateProps => ({
  behandling: fpBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  forrigeBehandling: fpBehandlingApi.BEHANDLING_FP.getRestApiPreviousData()(state),
  hasFetchError: !!fpBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch: Dispatch) => {
  Object.values(FpBehandlingApiKeys)
    .forEach((value) => {
      dispatch(fpBehandlingApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: fpBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: fpBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: fpBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: fpBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: fpBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    opneBehandlingForEndringer: fpBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
    opprettVerge: fpBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
    fjernVerge: fpBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
    hentBehandling: fpBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
    lagreRisikoklassifiseringAksjonspunkt: fpBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingForeldrepengerIndex);
