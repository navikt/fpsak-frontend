import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import {
  Kodeverk, NavAnsatt, FagsakInfo, fagsakInfoPropType, ErrorBoundary, DataFetcherBehandlingData,
} from '@fpsak-frontend/behandling-felles';
import ankeApi, { reduxRestApi } from './data/ankeBehandlingApi';
import AnkeGrid from './components/AnkeGrid';

const behandlingData = [ankeApi.BEHANDLING_ANKE];
const ankeData = [ankeApi.AKSJONSPUNKTER, ankeApi.VILKAR, ankeApi.ANKE_VURDERING];

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  navAnsatt: NavAnsatt;
  kodeverk: {[key: string]: [Kodeverk]};
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  valgtProsessSteg: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  visFeilmelding: (error: {}) => void;
  opneSokeside: () => void;
  alleBehandlinger: [{}];
}

interface DispatchProps {
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  destroyReduxForms: (formPrefix: string) => void;
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
}

type Props = DispatchProps & OwnProps;

interface AnkeState {
  fetchCounter: number;
}

class BehandlingAnkeIndex extends PureComponent<Props, AnkeState> {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    navAnsatt: navAnsattPropType.isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
    behandlingEventHandler: PropTypes.shape({}).isRequired,
    oppdaterProsessStegIUrl: PropTypes.func.isRequired,
    valgtProsessSteg: PropTypes.string.isRequired,
    visFeilmelding: PropTypes.func.isRequired,
    settPaVent: PropTypes.func.isRequired,
    hentBehandling: PropTypes.func.isRequired,
    opneSokeside: PropTypes.func.isRequired,
    alleBehandlinger: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { fetchCounter: 0 };
  }

  componentDidMount = () => {
    const {
      behandlingEventHandler, nyBehandlendeEnhet, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling,
    } = this.props;
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: (params) => nyBehandlendeEnhet(params)
        .then(() => this.setState((state) => ({ ...state, fetchCounter: state.fetchCounter + 1 }))),
      settBehandlingPaVent: (params) => settBehandlingPaVent(params)
        .then(() => this.setState((state) => ({ ...state, fetchCounter: state.fetchCounter + 1 }))),
      taBehandlingAvVent: (params) => taBehandlingAvVent(params),
      henleggBehandling: (params) => henleggBehandling(params),
    });
  }

  componentDidUpdate = (prevProps) => {
    const { destroyReduxForms, behandlingVersjon } = this.props;
    if (behandlingVersjon !== prevProps.behandlingVersjon) {
      setTimeout(() => destroyReduxForms(getBehandlingFormPrefix(prevProps.behandlingId, prevProps.behandlingVersjon)), 1000);
    }
  }

  componentWillUnmount = () => {
    const {
      behandlingEventHandler, destroyReduxForms, behandlingId, behandlingVersjon,
    } = this.props;
    behandlingEventHandler.clear();
    setTimeout(() => destroyReduxForms(getBehandlingFormPrefix(behandlingId, behandlingVersjon)), 1000);
  }

  render() {
    const {
      behandlingId,
      oppdaterBehandlingVersjon,
      fagsak,
      navAnsatt,
      kodeverk,
      oppdaterProsessStegIUrl,
      valgtProsessSteg,
      visFeilmelding,
      settPaVent,
      hentBehandling,
      opneSokeside,
      alleBehandlinger,
    } = this.props;
    const { fetchCounter } = this.state;
    return (
      <ErrorBoundary errorMessageCallback={visFeilmelding}>
        <DataFetcherBehandlingData
          showLoadingIcon
          showOldDataWhenRefetching
          fetchTrigger={fetchCounter}
          endpoints={behandlingData}
          endpointParams={{ behandlingId }}
          render={(dataProps) => {
            const { behandlingAnke } = dataProps;
            reduxRestApi.injectPaths(behandlingAnke.links);
            return (
              <DataFetcherBehandlingData
                showLoadingIcon
                showOldDataWhenRefetching
                fetchTrigger={behandlingAnke.versjon}
                endpoints={ankeData}
                render={(dProps) => (
                  <AnkeGrid
                    fagsak={fagsak}
                    behandling={behandlingAnke}
                    aksjonspunkter={dProps.aksjonspunkter}
                    vilkar={dProps.vilkar}
                    ankeVurdering={dProps.ankeVurdering}
                    navAnsatt={navAnsatt}
                    kodeverk={kodeverk}
                    valgtProsessSteg={valgtProsessSteg}
                    oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
                    oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
                    settPaVent={settPaVent}
                    hentBehandling={hentBehandling}
                    opneSokeside={opneSokeside}
                    alleBehandlinger={alleBehandlinger}
                  />
                )}
              />
            );
          }}
        />
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: ankeApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: ankeApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: ankeApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: ankeApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: ankeApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: ankeApi.BEHANDLING_ANKE.makeRestApiRequest(),
    destroyReduxForms: destroy,
  }, dispatch),
});

export default connect<{}, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingAnkeIndex);
