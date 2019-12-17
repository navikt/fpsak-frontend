import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, SettPaVentParams, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';

import papirsoknadApi, { PapirsoknadApiKeys } from './data/papirsoknadApi';
import PapirsoknadIndex from './components/PapirsoknadIndex';

interface DataProps {
  behandling: Behandling;
}

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  location: {};
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
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
      resetRestApiContext, destroyReduxForm, behandling,
    } = this.props;
    resetRestApiContext();
    setTimeout(() => destroyReduxForm(getBehandlingFormPrefix(behandling.id, behandling.versjon)), 1000);
  }

  render() {
    const {
      oppdaterBehandlingVersjon,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegIUrl,
      valgtProsessSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      behandling,
    } = this.props;

    if (!behandling) {
      return <LoadingPanel />;
    }

    return (
      <>
        <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={behandling.versjon} />
        <PapirsoknadIndex
          fagsak={fagsak}
          kodeverk={kodeverk}
          navAnsatt={navAnsatt}
          valgtProsessSteg={valgtProsessSteg}
          oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
          oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
          settPaVent={settPaVent}
          hentBehandling={hentBehandling}
          opneSokeside={opneSokeside}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: papirsoknadApi.BEHANDLING_INNSYN.getRestApiData()(state),
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
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingPapirsoknadIndex);
