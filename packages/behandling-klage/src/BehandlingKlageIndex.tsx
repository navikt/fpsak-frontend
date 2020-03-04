import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  FagsakInfo, DataFetcherBehandlingData, SettPaVentParams, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';
import { Behandling, Kodeverk, NavAnsatt } from '@fpsak-frontend/types';

import FetchedData from './types/fetchedDataTsType';
import klageApi, { reduxRestApi, KlageBehandlingApiKeys } from './data/klageBehandlingApi';
import KlagePaneler from './components/KlagePaneler';

const klageData = [klageApi.AKSJONSPUNKTER, klageApi.VILKAR, klageApi.KLAGE_VURDERING];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: Kodeverk[]};
  navAnsatt: NavAnsatt;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  alleBehandlinger: [{
    id: number;
    type: Kodeverk;
    avsluttet?: string;
    status: Kodeverk;
    uuid: string;
  }];
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

class BehandlingKlageIndex extends PureComponent<Props> {
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
      kodeverk,
      fagsak,
      navAnsatt,
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
        behandlingVersion={behandling.versjon}
        endpoints={klageData}
        showOldDataWhenRefetching
        render={(dataProps: FetchedData, isFinished) => (
          <>
            <ReduxFormStateCleaner behandlingId={behandling.id} behandlingVersjon={isFinished ? behandling.versjon : forrigeBehandling.versjon} />
            <KlagePaneler
              behandling={isFinished ? behandling : forrigeBehandling}
              fetchedData={dataProps}
              fagsak={fagsak}
              kodeverk={kodeverk}
              navAnsatt={navAnsatt}
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
  behandling: klageApi.BEHANDLING_KLAGE.getRestApiData()(state),
  forrigeBehandling: klageApi.BEHANDLING_KLAGE.getRestApiPreviousData()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(KlageBehandlingApiKeys)
    .forEach((value) => {
      dispatch(klageApi[value].resetRestApi()());
    });
};


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: klageApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: klageApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: klageApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: klageApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: klageApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: klageApi.BEHANDLING_KLAGE.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingKlageIndex);
