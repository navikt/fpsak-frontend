import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, fagsakInfoPropType, DataFetcherBehandlingData, SettPaVentParams, behandlingPropType, ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';

import tilbakekrevingApi, { reduxRestApi, TilbakekrevingBehandlingApiKeys } from './data/tilbakekrevingBehandlingApi';
import TilbakekrevingGrid from './components/TilbakekrevingGrid';

const tilbakekrevingData = [tilbakekrevingApi.AKSJONSPUNKTER, tilbakekrevingApi.PERIODER_FORELDELSE, tilbakekrevingApi.BEREGNINGSRESULTAT];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  harApenRevurdering: boolean;
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
  hentKodeverk: () => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface TilbakekrevingState {
  forrigeBehandling?: Behandling;
}

class BehandlingTilbakekrevingIndex extends PureComponent<Props, TilbakekrevingState> {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    kodeverk: PropTypes.shape({}),
    navAnsatt: navAnsattPropType.isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
    behandlingEventHandler: PropTypes.shape({}).isRequired,
    oppdaterProsessStegIUrl: PropTypes.func.isRequired,
    valgtProsessSteg: PropTypes.string,
    settPaVent: PropTypes.func.isRequired,
    hentBehandling: PropTypes.func.isRequired,
    hentKodeverk: PropTypes.func.isRequired,
    opneSokeside: PropTypes.func.isRequired,
    harApenRevurdering: PropTypes.bool.isRequired,
    resetRestApiContext: PropTypes.func.isRequired,
    destroyReduxForm: PropTypes.func.isRequired,
    hasFetchError: PropTypes.bool.isRequired,
    behandling: behandlingPropType,
  }

  constructor(props) {
    super(props);
    this.state = {
      forrigeBehandling: undefined,
    };
  }

  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId, hentKodeverk,
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
    hentKodeverk();
  }

  componentDidUpdate = (prevProps) => {
    const { behandling } = this.props;
    if (prevProps.behandling && behandling && behandling.versjon !== prevProps.behandling.versjon) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState((state) => ({ ...state, forrigeBehandling: prevProps.behandling }));
    }
    if (!prevProps.behandling && behandling) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState((state) => ({ ...state, forrigeBehandling: behandling }));
    }
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
      valgtProsessSteg,
      settPaVent,
      hentBehandling,
      opneSokeside,
      harApenRevurdering,
      hasFetchError,
    } = this.props;
    const {
      forrigeBehandling,
    } = this.state;

    if (!behandling || !kodeverk) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcherBehandlingData
        showLoadingIcon
        showOldDataWhenRefetching
        fetchTrigger={behandling.versjon}
        endpoints={tilbakekrevingData}
        render={(dataProps, isFetchFinished) => {
          const aktuellBehandling = isFetchFinished ? behandling : forrigeBehandling;
          if (!aktuellBehandling) {
            return <LoadingPanel />;
          }
          return (
            <>
              <ReduxFormStateCleaner behandlingId={aktuellBehandling.id} behandlingVersjon={aktuellBehandling.versjon} />
              <TilbakekrevingGrid
                fagsak={fagsak}
                behandling={behandling}
                kodeverk={kodeverk}
                navAnsatt={navAnsatt}
                valgtProsessSteg={valgtProsessSteg}
                oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
                oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
                settPaVent={settPaVent}
                hentBehandling={hentBehandling}
                opneSokeside={opneSokeside}
                harApenRevurdering={harApenRevurdering}
                hasFetchError={hasFetchError}
                {...dataProps}
              />
            </>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  behandling: tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiData()(state),
  kodeverk: tilbakekrevingApi.TILBAKE_KODEVERK.getRestApiData()(state),
  hasFetchError: !!tilbakekrevingApi.BEHANDLING_TILBAKE.getRestApiError()(state),
});

const getResetRestApiContext = () => (dispatch) => {
  Object.values(TilbakekrevingBehandlingApiKeys)
    .forEach((value) => {
      dispatch(tilbakekrevingApi[value].resetRestApi()());
    });
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: tilbakekrevingApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: tilbakekrevingApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: tilbakekrevingApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: tilbakekrevingApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: tilbakekrevingApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: tilbakekrevingApi.BEHANDLING_TILBAKE.makeRestApiRequest(),
    hentKodeverk: tilbakekrevingApi.TILBAKE_KODEVERK.makeRestApiRequest(),
    resetRestApiContext: getResetRestApiContext,
    destroyReduxForm: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingTilbakekrevingIndex);
