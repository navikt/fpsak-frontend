import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { ErrorTypes } from '@fpsak-frontend/rest-api';
import { getBehandlingFormPrefix } from '@fpsak-frontend/form';
import {
  FagsakInfo, Rettigheter, SettPaVentParams, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';
import {
  KodeverkMedNavn, Aksjonspunkt, Behandling,
} from '@fpsak-frontend/types';
import { DataFetcher, DataFetcherTriggers } from '@fpsak-frontend/rest-api-redux';
import { LoadingPanel } from '@fpsak-frontend/shared-components';

import papirsoknadApi, { reduxRestApi, PapirsoknadApiKeys } from './data/papirsoknadApi';
import RegistrerPapirsoknad from './components/RegistrerPapirsoknad';

const papirsoknadData = [papirsoknadApi.AKSJONSPUNKTER];

interface DataProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
}

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  rettigheter: Rettigheter;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
}

interface StateProps {
  behandling?: Behandling;
  forrigeBehandling?: Behandling;
  erAksjonspunktLagret: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: any) => Promise<void>;
  settBehandlingPaVent: (params: any) => Promise<void>;
  taBehandlingAvVent: (params: any, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: any) => Promise<void>;
  lagreAksjonspunkt: (params: any) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingPapirsoknadIndex extends PureComponent<Props> {
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
      kodeverk,
      fagsak,
      rettigheter,
      settPaVent,
      hentBehandling,
      behandling,
      forrigeBehandling,
      lagreAksjonspunkt,
      erAksjonspunktLagret,
    } = this.props;

    if (!behandling) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcher
        fetchingTriggers={new DataFetcherTriggers({ behandlingVersion: behandling.versjon }, true)}
        showOldDataWhenRefetching
        endpoints={papirsoknadData}
        loadingPanel={<LoadingPanel />}
        render={(dataProps: DataProps, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <RegistrerPapirsoknad
              behandling={isFinished ? behandling : forrigeBehandling}
              aksjonspunkter={dataProps.aksjonspunkter}
              fagsak={fagsak}
              kodeverk={kodeverk}
              rettigheter={rettigheter}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              lagreAksjonspunkt={lagreAksjonspunkt}
              erAksjonspunktLagret={erAksjonspunktLagret}
            />
          </>
        )}
      />
    );
  }
}

const hasAccessError = (error) => !!(error && error.type === ErrorTypes.MANGLER_TILGANG_FEIL);

const mapStateToProps = (state) => ({
  behandling: papirsoknadApi.BEHANDLING_PAPIRSOKNAD.getRestApiData()(state),
  forrigeBehandling: papirsoknadApi.BEHANDLING_PAPIRSOKNAD.getRestApiPreviousData()(state),
  erAksjonspunktLagret: papirsoknadApi.SAVE_AKSJONSPUNKT.getRestApiFinished()(state)
  || hasAccessError(papirsoknadApi.SAVE_AKSJONSPUNKT.getRestApiError()(state)),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(PapirsoknadApiKeys)
    .forEach((value) => {
      dispatch(papirsoknadApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: papirsoknadApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: papirsoknadApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: papirsoknadApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: papirsoknadApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: papirsoknadApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: papirsoknadApi.BEHANDLING_PAPIRSOKNAD.makeRestApiRequest(),
    lagreAksjonspunkt: papirsoknadApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingPapirsoknadIndex);
