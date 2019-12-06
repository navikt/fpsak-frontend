import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { navAnsattPropType } from '@fpsak-frontend/prop-types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Kodeverk, NavAnsatt, Behandling, FagsakInfo, fagsakInfoPropType, DataFetcherBehandlingData, SettPaVentParams, behandlingPropType,
  ReduxFormStateCleaner,
} from '@fpsak-frontend/behandling-felles';

import innsynApi, { reduxRestApi } from './data/innsynBehandlingApi';
import InnsynGrid from './components/InnsynGrid';

const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN, innsynApi.INNSYN_DOKUMENTER];

interface OwnProps {
  behandlingId: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: [Kodeverk]};
  navAnsatt: NavAnsatt;
  location: {};
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg: string;
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
  taBehandlingAvVent: (params: {}) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  settPaVent: (params: SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps;

interface BehandlingInnsynIndexState {
  forrigeBehandling?: Behandling;
}

class BehandlingInnsynIndex extends PureComponent<Props, BehandlingInnsynIndexState> {
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
    const { behandlingEventHandler } = this.props;
    behandlingEventHandler.clear();
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
        endpoints={innsynData}
        endpointParams={{ [innsynApi.INNSYN_DOKUMENTER.name]: { saksnummer: fagsak.saksnummer } }}
        render={(dataProps, isFetchFinished) => {
          const aktuellBehandling = isFetchFinished ? behandling : forrigeBehandling;
          return (
            <>
              <ReduxFormStateCleaner behandlingId={aktuellBehandling.id} behandlingVersjon={aktuellBehandling.versjon} />
              <InnsynGrid
                fagsak={fagsak}
                behandling={aktuellBehandling}
                kodeverk={kodeverk}
                navAnsatt={navAnsatt}
                valgtProsessSteg={valgtProsessSteg}
                oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
                oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
                settPaVent={settPaVent}
                hentBehandling={hentBehandling}
                opneSokeside={opneSokeside}
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
  behandling: innsynApi.BEHANDLING_INNSYN.getRestApiData()(state),
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: innsynApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: innsynApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: innsynApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: innsynApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: innsynApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: innsynApi.BEHANDLING_INNSYN.makeRestApiRequest(),
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingInnsynIndex);
