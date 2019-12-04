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
import klageApi, { reduxRestApi } from './data/klageBehandlingApi';
import KlageGrid from './components/KlageGrid';

const behandlingData = [klageApi.BEHANDLING_KLAGE];
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

interface KlageState {
  fetchCounter: number;
}

class BehandlingKlageIndex extends PureComponent<Props, KlageState> {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
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
      kodeverk,
      fagsak,
      navAnsatt,
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
            const { behandlingKlage } = dataProps;
            reduxRestApi.injectPaths(behandlingKlage.links);
            return (
              <DataFetcherBehandlingData
                showLoadingIcon
                showOldDataWhenRefetching
                fetchTrigger={behandlingKlage.versjon}
                endpoints={klageData}
                render={(dProps) => (
                  <KlageGrid
                    fagsak={fagsak}
                    behandling={behandlingKlage}
                    aksjonspunkter={dProps.aksjonspunkter}
                    vilkar={dProps.vilkar}
                    klageVurdering={dProps.klageVurdering}
                    kodeverk={kodeverk}
                    navAnsatt={navAnsatt}
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
    nyBehandlendeEnhet: klageApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: klageApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: klageApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: klageApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: klageApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: klageApi.BEHANDLING_KLAGE.makeRestApiRequest(),
    destroyReduxForms: destroy,
  }, dispatch),
});

export default connect<{}, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingKlageIndex);
