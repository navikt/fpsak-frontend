import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix, ErrorTypes } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Aksjonspunkt, Behandling, FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, DataFetcherBehandlingData,
  BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';

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
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  location: {};
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
}

interface StateProps {
  behandling?: Behandling;
  erAksjonspunktLagret: boolean;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}, { keepData: boolean }) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  lagreAksjonspunkt: (params: {}) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }, { keepData: boolean }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingPapirsoknadIndex extends PureComponent<Props> {
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
      kodeverk,
      fagsak,
      navAnsatt,
      settPaVent,
      hentBehandling,
      behandling,
      lagreAksjonspunkt,
      erAksjonspunktLagret,
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
        showOldDataWhenRefetching
        endpoints={papirsoknadData}
        render={(dataProps: DataProps) => (
          <>
            <ReduxFormStateCleaner behandlingId={dataProps.behandling.id} behandlingVersjon={dataProps.behandling.versjon} />
            <RegistrerPapirsoknad
              fagsak={fagsak}
              kodeverk={kodeverk}
              navAnsatt={navAnsatt}
              settPaVent={settPaVent}
              hentBehandling={hentBehandling}
              lagreAksjonspunkt={lagreAksjonspunkt}
              erAksjonspunktLagret={erAksjonspunktLagret}
              {...dataProps}
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
