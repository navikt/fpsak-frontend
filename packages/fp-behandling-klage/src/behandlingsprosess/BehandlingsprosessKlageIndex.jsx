import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { aksjonspunktPropType } from '@fpsak-frontend/fp-behandling-felles';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import {
  getAksjonspunkter, getBehandlingVersjon, getBehandlingType,
} from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import {
  getBehandlingIdentifier,
} from 'behandlingKlage/src/duckKlage';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import BehandlingsprosessPanel from 'behandlingKlage/src/behandlingsprosess/components/BehandlingsprosessPanel';
import IverksetterVedtakStatusModal from 'behandlingKlage/src/behandlingsprosess/components/vedtak/IverksetterVedtakStatusModal';
import FatterVedtakStatusModal from 'behandlingKlage/src/behandlingsprosess/components/vedtak/FatterVedtakStatusModal';
import KlageBehandlingModal from 'behandlingKlage/src/behandlingsprosess/components/klage/KlageBehandlingModal';
import BehandlingspunktKlageInfoPanel from 'behandlingKlage/src/behandlingsprosess/components/BehandlingspunktKlageInfoPanel';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import {
  setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  fetchPreviewBrev as fetchPreview,
  getSelectedBehandlingspunktNavn,
  fetchPreviewKlageBrev,
  resolveKlageTemp,
  saveKlage,
} from './duckBpKlage';
import { getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt }
  from './behandlingsprosessKlageSelectors';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const hasOverstyringAp = aksjonspunkter => (
  aksjonspunkter.some(ap => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING)
);

// TODO (TOR) Refaktorer: veldig mykje av dette er felles med andre behandlingstypar. Flytt ut i hooks?

/**
 * BehandlingsprosessKlageIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessKlageIndex extends Component {
  constructor() {
    super();

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
    this.previewVedtakCallback = this.previewVedtakCallback.bind(this);
    this.previewCallbackKlage = this.previewCallbackKlage.bind(this);
    this.setShowModalKlageBehandling = this.setShowModalKlageBehandling.bind(this);
    this.saveKlageText = this.saveKlageText.bind(this);

    this.state = {
      showModalKlageBehandling: false,
    };
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

  setShowModalKlageBehandling(showModal) {
    this.setState({
      showModalKlageBehandling: showModal,
    });
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

  previewCallbackKlage(data) {
    const { behandlingIdentifier, fetchPreviewKlageBrev: fetchBrevPreview } = this.props;
    const brevData = {
      ...data,
      behandlingId: behandlingIdentifier.behandlingId,
    };
    fetchBrevPreview(brevData);
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

  saveKlageText(aksjonspunktModel, shouldReopenAp) {
    const { behandlingIdentifier, saveKlage: saveTempKlage, resolveKlageTemp: resolveKlage } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      ...aksjonspunktModel,
    };
    if (shouldReopenAp) {
      resolveKlage(behandlingIdentifier, data);
    } else {
      saveTempKlage(data);
    }
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

    const skalByttTilKlageinstans = aksjonspunktModels
      .some(apValue => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP && apValue.klageVurdering === klageVurdering.STADFESTE_YTELSESVEDTAK);
    const shouldUpdateInfo = !skalByttTilKlageinstans;
    const afterSubmit = () => {
      if (skalByttTilKlageinstans) {
        this.setShowModalKlageBehandling(true);
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
      behandlingspunkter, selectedBehandlingspunkt,
    } = this.props;
    const { showModalKlageBehandling } = this.state;
    return (
      <React.Fragment>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
        >
          <BehandlingspunktKlageInfoPanel
            submitCallback={this.submitVilkar}
            previewCallback={this.previewCallback}
            saveTempKlage={this.saveKlageText}
            previewVedtakCallback={this.previewVedtakCallback}
            previewCallbackKlage={this.previewCallbackKlage}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        </BehandlingsprosessPanel>

        <IverksetterVedtakStatusModal closeEvent={this.goToSearchPage} />
        <FatterVedtakStatusModal closeEvent={this.goToSearchPage} />
        <KlageBehandlingModal showModal={showModalKlageBehandling} closeEvent={this.goToSearchPage} />
      </React.Fragment>
    );
  }
}

BehandlingsprosessKlageIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  saveKlage: PropTypes.func.isRequired,
  resolveKlageTemp: PropTypes.func.isRequired,
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
  fetchPreviewKlageBrev: PropTypes.func.isRequired,
  fetchVedtaksbrevPreview: PropTypes.func.isRequired,
};

BehandlingsprosessKlageIndex.defaultProps = {
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
    fetchPreviewKlageBrev,
    resolveProsessAksjonspunkter,
    overrideProsessAksjonspunkter,
    fetchVedtaksbrevPreview,
    resetBehandlingspunkter,
    saveKlage,
    resolveKlageTemp,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessKlageIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
