import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Behandling, Kodeverk, NavAnsatt,
} from '@fpsak-frontend/types';
import {
  FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, DataFetcherBehandlingData,
} from '@fpsak-frontend/behandling-felles';

import esBehandlingApi, { reduxRestApi, EsBehandlingApiKeys } from './data/esBehandlingApi';
import EngangsstonadPaneler from './components/EngangsstonadPaneler';
import FetchedData from './types/fetchedDataTsType';

const engansstonadData = [esBehandlingApi.AKSJONSPUNKTER, esBehandlingApi.VILKAR, esBehandlingApi.PERSONOPPLYSNINGER,
  esBehandlingApi.SOKNAD, esBehandlingApi.INNTEKT_ARBEID_YTELSE, esBehandlingApi.SIMULERING_RESULTAT,
  esBehandlingApi.BEREGNINGRESULTAT_ENGANGSSTONAD];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  featureToggles: {};
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  kodeverk?: {[key: string]: [Kodeverk]};
  hasFetchError: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  opneBehandlingForEndringer: (params: {}) => Promise<any>;
  opprettVerge: (params: {}) => Promise<any>;
  fjernVerge: (params: {}) => Promise<any>;
  lagreRisikoklassifiseringAksjonspunkt: (params: {}) => Promise<any>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingEngangsstonadIndex extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling,
      hentBehandling, behandlingId, opneBehandlingForEndringer, opprettVerge, fjernVerge, lagreRisikoklassifiseringAksjonspunkt,
    } = this.props;
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
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegOgFaktaPanelIUrl,
      valgtProsessSteg,
      valgtFaktaSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      hasFetchError,
      featureToggles,
    } = this.props;

    if (!behandling) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcherBehandlingData
        behandlingVersion={behandling.versjon}
        endpoints={engansstonadData}
        showOldDataWhenRefetching
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <EngangsstonadPaneler
              behandling={isFinished ? behandling : forrigeBehandling}
              fetchedData={dataProps}
              fagsak={fagsak}
              alleKodeverk={kodeverk}
              navAnsatt={navAnsatt}
              valgtProsessSteg={valgtProsessSteg}
              valgtFaktaSteg={valgtFaktaSteg}
              oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
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
  }
}

const mapStateToProps = (state) => ({
  behandling: esBehandlingApi.BEHANDLING_ES.getRestApiData()(state),
  forrigeBehandling: esBehandlingApi.BEHANDLING_ES.getRestApiPreviousData()(state),
  hasFetchError: !!esBehandlingApi.BEHANDLING_ES.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(EsBehandlingApiKeys)
    .forEach((value) => {
      dispatch(esBehandlingApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: esBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: esBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: esBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: esBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: esBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    opneBehandlingForEndringer: esBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
    opprettVerge: esBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
    fjernVerge: esBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
    hentBehandling: esBehandlingApi.BEHANDLING_ES.makeRestApiRequest(),
    lagreRisikoklassifiseringAksjonspunkt: esBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingEngangsstonadIndex);
