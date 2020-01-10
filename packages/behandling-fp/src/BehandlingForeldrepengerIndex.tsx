import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, DataFetcherBehandlingDataV2, BehandlingDataProvider,
} from '@fpsak-frontend/behandling-felles';

import fpBehandlingApi, { reduxRestApi, FpBehandlingApiKeys } from './data/fpBehandlingApi';
import ForeldrepengerGrid from './components/ForeldrepengerGrid';
import FetchedData from './types/fetchedDataTsType';

const foreldrepengerData = [fpBehandlingApi.AKSJONSPUNKTER, fpBehandlingApi.VILKAR, fpBehandlingApi.PERSONOPPLYSNINGER, fpBehandlingApi.YTELSEFORDELING,
  fpBehandlingApi.SOKNAD, fpBehandlingApi.INNTEKT_ARBEID_YTELSE, fpBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER, fpBehandlingApi.BEREGNINGSGRUNNLAG,
  fpBehandlingApi.UTTAK_STONADSKONTOER, fpBehandlingApi.UTTAKSRESULTAT_PERIODER, fpBehandlingApi.SIMULERING_RESULTAT];


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

class BehandlingForeldrepengerIndex extends PureComponent<Props> {
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
          endpoints={foreldrepengerData}
          showOldDataWhenRefetching
          render={(dataProps: FetchedData) => (
            <>
              <ReduxFormStateCleaner behandlingId={dataProps.behandling.id} behandlingVersjon={dataProps.behandling.versjon} />
              <ForeldrepengerGrid
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
  behandling: fpBehandlingApi.BEHANDLING_FP.getRestApiData()(state),
  hasFetchError: !!fpBehandlingApi.BEHANDLING_FP.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch) => {
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
    hentBehandling: fpBehandlingApi.BEHANDLING_FP.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingForeldrepengerIndex);
