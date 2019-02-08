import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';
import { aksjonspunktPropType } from '@fpsak-frontend/fp-behandling-felles';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import {
  getAksjonspunkter, getBehandlingVersjon, getBehandlingType,
} from 'behandlingFpsak/src/behandlingSelectors';
import {
  getBehandlingIdentifier,
} from 'behandlingFpsak/src/duck';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import BehandlingsprosessPanel from 'behandlingFpsak/src/behandlingsprosess/components/BehandlingsprosessPanel';
import IverksetterVedtakStatusModal from 'behandlingFpsak/src/behandlingsprosess/components/vedtak/IverksetterVedtakStatusModal';
import FatterVedtakStatusModal from 'behandlingFpsak/src/behandlingsprosess/components/vedtak/FatterVedtakStatusModal';
import BehandlingspunktInfoPanel from 'behandlingFpsak/src/behandlingsprosess/components/BehandlingspunktInfoPanel';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import {
  setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  fetchPreviewBrev as fetchPreview,
  getSelectedBehandlingspunktNavn,
} from './duck';
import { getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt }
  from './behandlingsprosessSelectors';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const hasRevurderingAp = apModels => (
  apModels.some(apValue => (
    (apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL || apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apValue.sendVarsel
  ))
);

const hasOverstyringAp = aksjonspunkter => (
  aksjonspunkter.some(ap => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING)
);

// TODO (TOR) Refaktorer: veldig mykje av dette er felles med andre behandlingstypar. Flytt ut i hooks?

/**
 * BehandlingsprosessIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessIndex extends Component {
  constructor() {
    super();

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
    this.previewVedtakCallback = this.previewVedtakCallback.bind(this);
    this.previewManueltBrevCallback = this.previewManueltBrevCallback.bind(this);
  }

  componentDidMount() {
    this.setup();
  }

  componentDidUpdate(prevProps) {
    this.setup(prevProps.behandlingVersjon);
  }

  componentWillUnmount() {
    const { resetBehandlingspunkter: resetBp } = this.props;
    resetBp();
  }

  setup(prevBehandlingVersjon) {
    const { behandlingVersjon, resetBehandlingspunkter: resetBp } = this.props;
    if (behandlingVersjon !== prevBehandlingVersjon) {
      resetBp();
    }
  }

  /* NOTE: Denne er en slags toggle, selv om ikke navnet tilsier det */
  goToBehandlingspunkt(punktName) {
    const { selectedBehandlingspunkt, push: pushLocation, location } = this.props;
    if (!punktName || punktName === selectedBehandlingspunkt) {
      pushLocation(getBehandlingspunktLocation(location)(null));
    } else {
      pushLocation(getBehandlingspunktLocation(location)(formatBehandlingspunktName(punktName)));
    }
  }

  goToBehandlingWithDefaultPunktAndFakta() {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithDefaultBehandlingspunktAndFakta(location));
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  previewCallback(mottaker, brevmalkode, fritekst) {
    const { behandlingIdentifier, fetchPreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      fritekst: fritekst || '',
      mottaker,
      brevmalkode,
    };
    fetchBrevPreview(data);
  }

  previewVedtakCallback(fritekst) {
    const { behandlingIdentifier, fetchVedtaksbrevPreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      fritekst: fritekst || '',
      skalBrukeOverstyrendeFritekstBrev: false,
    };
    fetchBrevPreview(data);
  }

  previewManueltBrevCallback(values) {
    const { behandlingIdentifier, fetchVedtaksbrevPreview: fetchBrevPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      ...values,
    };
    fetchBrevPreview(data);
  }

  submitVilkar(aksjonspunktModels) {
    const {
      resolveProsessAksjonspunkter: resolveAksjonspunkter,
      overrideProsessAksjonspunkter: overrideAksjonspunkter,
      behandlingIdentifier, behandlingVersjon, aksjonspunkter,
    } = this.props;
    const models = aksjonspunktModels.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));

    const apCodes = aksjonspunktModels.map(ap => ap.kode);

    const submitIsRevurdering = hasRevurderingAp(aksjonspunktModels);
    const shouldUpdateInfo = !submitIsRevurdering;
    const afterSubmit = () => {
      if (submitIsRevurdering) {
        this.goToSearchPage();
      } else {
        this.goToBehandlingWithDefaultPunktAndFakta();
      }
    };

    const aktuelleAksjonspunkter = aksjonspunkter.filter(ap => apCodes.includes(ap.definisjon.kode));
    if (aktuelleAksjonspunkter.length === 0 || hasOverstyringAp(aktuelleAksjonspunkter)) {
      const params = {
        ...behandlingIdentifier.toJson(),
        behandlingVersjon,
        overstyrteAksjonspunktDtoer: models,
      };
      return overrideAksjonspunkter(behandlingIdentifier, params, shouldUpdateInfo)
        .then(afterSubmit);
    }

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: models,
    };
    return resolveAksjonspunkter(behandlingIdentifier, params, shouldUpdateInfo)
      .then(afterSubmit);
  }

  render() {
    const {
      behandlingspunkter, selectedBehandlingspunkt, dispatchSubmitFailed: submitFailedDispatch,
    } = this.props;
    return (
      <React.Fragment>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
        >
          <BehandlingspunktInfoPanel
            submitCallback={this.submitVilkar}
            previewCallback={this.previewCallback}
            previewVedtakCallback={this.previewVedtakCallback}
            previewManueltBrevCallback={this.previewManueltBrevCallback}
            dispatchSubmitFailed={submitFailedDispatch}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        </BehandlingsprosessPanel>

        <IverksetterVedtakStatusModal closeEvent={this.goToSearchPage} />
        <FatterVedtakStatusModal closeEvent={this.goToSearchPage} />
      </React.Fragment>
    );
  }
}

BehandlingsprosessIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  overrideProsessAksjonspunkter: PropTypes.func.isRequired,
  fetchPreview: PropTypes.func.isRequired,
  fetchVedtaksbrevPreview: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
};

BehandlingsprosessIndex.defaultProps = {
  behandlingspunkter: undefined,
  selectedBehandlingspunkt: undefined,
};

const mapStateToProps = state => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingspunkter: getBehandlingspunkter(state),
  defaultBehandlingspunkt: getDefaultBehandlingspunkt(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  behandlingType: getBehandlingType(state),
  location: state.router.location,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    fetchPreview,
    resolveProsessAksjonspunkter,
    overrideProsessAksjonspunkter,
    fetchVedtaksbrevPreview,
    resetBehandlingspunkter,
    dispatchSubmitFailed,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
