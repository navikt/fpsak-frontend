import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { destroy } from 'redux-form';

import { DataFetcher, getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';
import { navAnsattPropType } from '@fpsak-frontend/prop-types';

import { Kodeverk } from './types/kodeverkTsType';
import { FagsakInfo } from './types/fagsakInfoTsType';
import fagsakInfoPropType from './propTypes/fagsakInfoPropType';
import innsynApi, { reduxRestApi } from './data/innsynBehandlingApi';
import InnsynGrid from './components/InnsynGrid';
import ErrorBoundary from './components/ErrorBoundary';
import DataFetcherTest from './DataFetcherTest';
import DataFetcherInnsynTest from './DataFetcherInnsynTest';

const behandlingData = [innsynApi.BEHANDLING_INNSYN];
const innsynData = [innsynApi.AKSJONSPUNKTER, innsynApi.VILKAR, innsynApi.INNSYN];

type InnsynProps = Readonly<{
  behandlingId: number;
  behandlingVersjon: number;
  fagsak: FagsakInfo;
  kodeverk: Kodeverk;
  alleDokumenter: [{
    id: number;
  }];
  navAnsatt: {};
  location: {};
  oppdaterLocation: () => {};
  oppdaterBehandlingVersjon: () => number;
  behandlingEventHandler: {
    setHandler: ({}) => void;
    clear: () => void;
  };
}>;

class BehandlingInnsynIndex extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { fetchCounter: 0 };
  }

  componentDidMount = () => {
    const {
      behandlingEventHandler, behandlingId, nyBehandlendeEnhet, hentBehandlingInnsyn, settBehandlingPaVent, taBehandlingAvVent, henleggBehandling,
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
      fagsak,
      kodeverk,
      alleDokumenter,
      navAnsatt,
      valgtPunkt,
      oppdaterLocation,
      oppdaterBehandlingVersjon,
      lageAksjonspunkt,
      forhandsvisMelding,
    } = this.props;
    const { fetchCounter } = this.state;
    return (
      <ErrorBoundary>
        <DataFetcherTest
          showLoadingIcon
          showOldDataWhenRefetching
          fetchTrigger={fetchCounter}
          endpoints={behandlingData}
          endpointParams={{ behandlingId }}
          render={(dataProps) => {
            const { behandlingInnsyn } = dataProps;
            reduxRestApi.injectPaths(behandlingInnsyn.links);
            return (
              <DataFetcherInnsynTest
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
                    valgtPunkt={valgtPunkt}
                    oppdaterLocation={oppdaterLocation}
                    oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
                    lageAksjonspunkt={lageAksjonspunkt}
                    forhandsvisMelding={forhandsvisMelding}
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

BehandlingInnsynIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsak: fagsakInfoPropType.isRequired,
  kodeverk: PropTypes.shape().isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtPunkt: PropTypes.string.isRequired,
  oppdaterLocation: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  behandlingEventHandler: PropTypes.shape().isRequired,
};

const mapStateToProps = (state, ownProps) => {
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    nyBehandlendeEnhet: innsynApi.BEHANDLING_NY_BEHANDLENDE_ENHET.makeRestApiRequest(),
    hentBehandlingInnsyn: innsynApi.BEHANDLING_INNSYN.makeRestApiRequest(),
    settBehandlingPaVent: innsynApi.BEHANDLING_ON_HOLD.makeRestApiRequest(),
    taBehandlingAvVent: innsynApi.RESUME_BEHANDLING.makeRestApiRequest(),
    henleggBehandling: innsynApi.HENLEGG_BEHANDLING.makeRestApiRequest(),
    lageAksjonspunkt: innsynApi.SAVE_AKSJONSPUNKT.makeRestApiRequest(),
    forhandsvisMelding: innsynApi.PREVIEW_MESSAGE.makeRestApiRequest(),
    destroyReduxForms: destroy,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingInnsynIndex);
