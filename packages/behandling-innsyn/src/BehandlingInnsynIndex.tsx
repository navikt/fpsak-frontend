import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { destroy } from 'redux-form';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import {
  Kodeverk, Dokument, NavAnsatt, FagsakInfo, fagsakInfoPropType, ErrorBoundary, DataFetcherBehandlingData,
} from '@fpsak-frontend/behandling-felles';
import innsynApi, { reduxRestApi } from './data/innsynBehandlingApi';
import InnsynGrid from './components/InnsynGrid';

const behandlingData = [innsynApi.BEHANDLING_INNSYN];
const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN];

type OwnProps = Readonly<{
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: [Kodeverk]};
  alleDokumenter: [Dokument];
  navAnsatt: NavAnsatt;
  location: {};
  oppdaterProsessStegIUrl: (punktnavn: string) => void;
  valgtProsessSteg: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: {[key: string]: (params: {}) => Promise<any> }) => void;
    clear: () => void;
  };
  visFeilmelding: (error: {}) => void;
}>;

type StateProps = {}

type DispatchProps = Readonly<{
  nyBehandlendeEnhet: (params: {}) => Promise<void>;
  settBehandlingPaVent: (params: {}) => Promise<void>;
  taBehandlingAvVent: (params: {}) => Promise<void>;
  henleggBehandling: (params: {}) => Promise<void>;
  destroyReduxForms: (formPrefix: string) => void;
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
}>

type Props = DispatchProps & OwnProps;

type InnsynState = Readonly<{
  fetchCounter: number;
}>

class BehandlingInnsynIndex extends PureComponent<Props, InnsynState> {
  static propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    fagsak: fagsakInfoPropType.isRequired,
    kodeverk: PropTypes.shape({}).isRequired,
    alleDokumenter: PropTypes.arrayOf(PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string.isRequired,
    })).isRequired,
    navAnsatt: navAnsattPropType.isRequired,
    oppdaterBehandlingVersjon: PropTypes.func.isRequired,
    behandlingEventHandler: PropTypes.shape({}).isRequired,
    oppdaterProsessStegIUrl: PropTypes.func.isRequired,
    valgtProsessSteg: PropTypes.string.isRequired,
    visFeilmelding: PropTypes.func.isRequired,
    settPaVent: PropTypes.func.isRequired,
    hentBehandling: PropTypes.func.isRequired,
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
    const { behandlingEventHandler, destroyReduxForms, behandlingVersjon } = this.props;
    behandlingEventHandler.clear();
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
      alleDokumenter,
      kodeverk,
      fagsak,
      navAnsatt,
      oppdaterProsessStegIUrl,
      valgtProsessSteg,
      visFeilmelding,
      settPaVent,
      hentBehandling,
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
            const { behandlingInnsyn } = dataProps;
            reduxRestApi.injectPaths(behandlingInnsyn.links);
            return (
              <DataFetcherBehandlingData
                showLoadingIcon
                showOldDataWhenRefetching
                fetchTrigger={behandlingInnsyn.versjon}
                endpoints={innsynData}
                render={(dProps) => (
                  <InnsynGrid
                    fagsak={fagsak}
                    behandling={behandlingInnsyn}
                    aksjonspunkter={dProps.aksjonspunkter}
                    vilkar={dProps.vilkar}
                    innsyn={dProps.innsyn}
                    kodeverk={kodeverk}
                    alleDokumenter={alleDokumenter}
                    navAnsatt={navAnsatt}
                    valgtProsessSteg={valgtProsessSteg}
                    oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
                    oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
                    settPaVent={settPaVent}
                    hentBehandling={hentBehandling}
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

const mapStateToProps = (): StateProps => ({});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: innsynApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    settBehandlingPaVent: innsynApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: innsynApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: innsynApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    settPaVent: innsynApi.UPDATE_ON_HOLD.makeRestApiRequest(),
    hentBehandling: innsynApi.BEHANDLING_INNSYN.makeRestApiRequest(),
    destroyReduxForms: destroy,
  }, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(BehandlingInnsynIndex);
