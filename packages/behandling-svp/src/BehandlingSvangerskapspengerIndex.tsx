import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, SettPaVentParams, ReduxFormStateCleaner, DataFetcherBehandlingData,
} from '@fpsak-frontend/behandling-felles';
import {
  Kodeverk, NavAnsatt, Behandling,
} from '@fpsak-frontend/types';

import svpBehandlingApi, { reduxRestApi, SvpBehandlingApiKeys } from './data/svpBehandlingApi';
import SvangerskapspengerPaneler from './components/SvangerskapspengerPaneler';
import FetchedData from './types/fetchedDataTsType';

const svangerskapspengerData = [svpBehandlingApi.AKSJONSPUNKTER, svpBehandlingApi.VILKAR, svpBehandlingApi.PERSONOPPLYSNINGER,
  svpBehandlingApi.SOKNAD, svpBehandlingApi.INNTEKT_ARBEID_YTELSE, svpBehandlingApi.BEREGNINGSGRUNNLAG,
  svpBehandlingApi.SIMULERING_RESULTAT, svpBehandlingApi.BEREGNINGRESULTAT_FORELDREPENGER];

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

class BehandlingSvangerskapspengerIndex extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId,
      opneBehandlingForEndringer, opprettVerge, fjernVerge, lagreRisikoklassifiseringAksjonspunkt,
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
        endpoints={svangerskapspengerData}
        showOldDataWhenRefetching
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <SvangerskapspengerPaneler
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
  behandling: svpBehandlingApi.BEHANDLING_SVP.getRestApiData()(state),
  forrigeBehandling: svpBehandlingApi.BEHANDLING_SVP.getRestApiPreviousData()(state),
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
    opneBehandlingForEndringer: svpBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest(),
    opprettVerge: svpBehandlingApi.VERGE_OPPRETT.makeRestApiRequest(),
    fjernVerge: svpBehandlingApi.VERGE_FJERN.makeRestApiRequest(),
    hentBehandling: svpBehandlingApi.BEHANDLING_SVP.makeRestApiRequest(),
    lagreRisikoklassifiseringAksjonspunkt: svpBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<any, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingSvangerskapspengerIndex);
