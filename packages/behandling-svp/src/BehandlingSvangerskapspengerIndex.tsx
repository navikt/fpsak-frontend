import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, DataFetcherBehandlingDataV2, BehandlingDataProvider,
} from '@fpsak-frontend/behandling-felles';

import svpBehandlingApi, { reduxRestApi, SvpBehandlingApiKeys } from './data/svpBehandlingApi';
import SvangerskapspengerGrid from './components/SvangerskapspengerGrid';
import FetchedData from './types/fetchedDataTsType';

const svangerskapspengerData = [svpBehandlingApi.AKSJONSPUNKTER, svpBehandlingApi.VILKAR, svpBehandlingApi.PERSONOPPLYSNINGER,
  svpBehandlingApi.SOKNAD, svpBehandlingApi.INNTEKT_ARBEID_YTELSE, svpBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER, svpBehandlingApi.BEREGNINGSGRUNNLAG,
  svpBehandlingApi.SIMULERING_RESULTAT];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterFaktaPanelIUrl: (faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  featureToggles: {};
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
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class BehandlingSvangerskapspengerIndex extends PureComponent<Props> {
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
      oppdaterBehandlingVersjon,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegIUrl,
      oppdaterFaktaPanelIUrl,
      valgtProsessSteg,
      valgtFaktaSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      hasFetchError,
      featureToggles,
    } = this.props;

    if (!behandling || !kodeverk) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <BehandlingDataProvider behandling={behandling}>
        <DataFetcherBehandlingDataV2
          behandlingVersion={behandling.versjon}
          endpoints={svangerskapspengerData}
          showOldDataWhenRefetching
          render={(dataProps: FetchedData) => (
            <>
              <ReduxFormStateCleaner behandlingId={dataProps.behandling.id} behandlingVersjon={dataProps.behandling.versjon} />
              <SvangerskapspengerGrid
                fetchedData={dataProps}
                fagsak={fagsak}
                alleKodeverk={kodeverk}
                navAnsatt={navAnsatt}
                valgtProsessSteg={valgtProsessSteg}
                oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
                valgtFaktaSteg={valgtFaktaSteg}
                oppdaterFaktaPanelIUrl={oppdaterFaktaPanelIUrl}
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
      </BehandlingDataProvider>
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: svpBehandlingApi.BEHANDLING_SVP.getRestApiData()(state),
  hasFetchError: !!svpBehandlingApi.BEHANDLING_SVP.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(SvpBehandlingApiKeys)
    .forEach((value) => {
      dispatch(svpBehandlingApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: svpBehandlingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: svpBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: svpBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: svpBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: svpBehandlingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: svpBehandlingApi.BEHANDLING_SVP.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingSvangerskapspengerIndex);
