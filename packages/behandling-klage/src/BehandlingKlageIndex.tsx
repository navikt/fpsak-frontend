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

import klageApi, { reduxRestApi, KlageBehandlingApiKeys } from './data/klageBehandlingApi';
import KlageGrid from './components/KlageGrid';

const klageData = [klageApi.AKSJONSPUNKTER, klageApi.VILKAR, klageApi.KLAGE_VURDERING];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: [Kodeverk]};
  navAnsatt: NavAnsatt;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  alleBehandlinger: [{}];
}

interface StateProps {
  behandling?: Behandling;
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
  resetRestApiContext: () => (dspatch: any) => void;
  destroyReduxForm: (form: string) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface KlageState {
  forrigeBehandling?: Behandling;
}

class BehandlingKlageIndex extends PureComponent<Props, KlageState> {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
    behandlingEventHandler: PropTypes.shape({}).isRequired,
    oppdaterProsessStegIUrl: PropTypes.func.isRequired,
    valgtProsessSteg: PropTypes.string.isRequired,
    settPaVent: PropTypes.func.isRequired,
    hentBehandling: PropTypes.func.isRequired,
    opneSokeside: PropTypes.func.isRequired,
    alleBehandlinger: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    resetRestApiContext: PropTypes.func.isRequired,
    destroyReduxForm: PropTypes.func.isRequired,
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
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling, hentBehandling, behandlingId,
    } = this.props;
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => hentBehandling({ behandlingId })),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => hentBehandling({ behandlingId })),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params),
      henleggBehandling: (params) => henleggBehandling(params),
    });

    hentBehandling({ behandlingId });
  }

  componentDidUpdate = (prevProps) => {
    const { behandling } = this.props;
    if (prevProps.behandling && behandling.versjon !== prevProps.behandling.versjon) {
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
      alleBehandlinger,
    } = this.props;
    const {
      forrigeBehandling,
    } = this.state;

    if (!behandling) {
      return <LoadingPanel />;
    }

    reduxRestApi.injectPaths(behandling.links);

    return (
      <DataFetcherBehandlingData
        showLoadingIcon
        showOldDataWhenRefetching
        fetchTrigger={behandling.versjon}
        endpoints={klageData}
        render={(dataProps, isFetchFinished) => {
          const aktuellBehandling = isFetchFinished ? behandling : forrigeBehandling;
          return (
            <>
              <ReduxFormStateCleaner behandlingId={aktuellBehandling.id} behandlingVersjon={aktuellBehandling.versjon} />
              <KlageGrid
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
                alleBehandlinger={alleBehandlinger}
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
  behandling: klageApi.BEHANDLING_KLAGE.getRestApiData()(state),
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
