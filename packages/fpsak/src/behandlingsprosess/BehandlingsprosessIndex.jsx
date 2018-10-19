import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { replaceNorwegianCharacters } from 'utils/languageUtils';
import { getAksjonspunkter, getSelectedBehandlingIdentifier, getBehandlingVersjon } from 'behandling/behandlingSelectors';
import BehandlingsprosessPanel from 'behandlingsprosess/components/BehandlingsprosessPanel';
import IverksetterVedtakStatusModal from 'behandlingsprosess/components/vedtak/IverksetterVedtakStatusModal';
import FatterVedtakStatusModal from 'behandlingsprosess/components/vedtak/FatterVedtakStatusModal';
import KlageBehandlingModal from 'behandlingsprosess/components/klage/KlageBehandlingModal';
import BehandlingspunktInfoPanel from 'behandlingsprosess/components/BehandlingspunktInfoPanel';
import requireProps from 'app/data/requireProps';
import aksjonspunktType from 'kodeverk/aksjonspunktType';
import klageVurdering from 'kodeverk/klageVurdering';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import { getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta } from 'app/paths';
import trackRouteParam from 'app/data/trackRouteParam';
import {
  setSelectedBehandlingspunktNavn, resolveProsessAksjonspunkter, overrideProsessAksjonspunkter,
  resetBehandlingspunkter, fetchPreviewBrev as fetchPreview, getSelectedBehandlingspunktNavn,
} from './duck';
import { getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt }
  from './behandlingsprosessSelectors';

const Wrapper = ({ children }) => children;

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const hasKlageAp = apModels => (
  apModels.some(apValue => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP && apValue.klageVurdering === klageVurdering.STADFESTE_YTELSESVEDTAK)
);

const hasRevurderingAp = apModels => (
  apModels.some(apValue => (
    (apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL || apValue.kode === aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL) && apValue.sendVarsel
  ))
);

const hasOverstyringAp = aksjonspunkter => (
  aksjonspunkter.some(ap => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING)
);

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
    this.setShowModalKlageBehandling = this.setShowModalKlageBehandling.bind(this);

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
    const { selectedBehandlingspunkt, push, location } = this.props;
    if (!punktName || punktName === selectedBehandlingspunkt) {
      push(getBehandlingspunktLocation(location)(null));
    } else {
      push(getBehandlingspunktLocation(location)(formatBehandlingspunktName(punktName)));
    }
  }

  goToBehandlingWithDefaultPunktAndFakta() {
    const { push, location } = this.props;
    push(getLocationWithDefaultBehandlingspunktAndFakta(location));
  }

  goToSearchPage() {
    const { push } = this.props;
    push('/');
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

    const submitIsKlage = hasKlageAp(aksjonspunktModels);
    const submitIsRevurdering = hasRevurderingAp(aksjonspunktModels);
    const shouldUpdateInfo = !submitIsKlage && !submitIsRevurdering;
    const afterSubmit = () => {
      if (submitIsRevurdering) {
        this.goToSearchPage();
      } else if (submitIsKlage) {
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
    const { behandlingspunkter, selectedBehandlingspunkt, dispatchSubmitFailed: submitFailedDispatch } = this.props;
    const { showModalKlageBehandling } = this.state;
    return (
      <Wrapper>
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
        <KlageBehandlingModal showModal={showModalKlageBehandling} closeEvent={this.goToSearchPage} />
      </Wrapper>
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
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingspunkter: getBehandlingspunkter(state),
  defaultBehandlingspunkt: getDefaultBehandlingspunkt(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  avslagReasons: state.default.behandlingsprosessContext.avslagReasons,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    ...routerActions,
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
