import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import {
  getAksjonspunkter, getBehandlingVersjon, getBehandlingType, getBehandlingStatus, getBehandlingsresultat, getBehandlingHenlagt,
} from 'behandlingKlage/src/anke/selectors/ankeBehandlingSelectors';
import {
  getBehandlingIdentifier, getFagsakYtelseType,
hentAnkeVurdering, getResultat,
} from 'behandlingKlage/src/anke/duckAnke';
import { BehandlingsprosessPanel, FatterVedtakStatusModal, IverksetterVedtakStatusModal } from '@fpsak-frontend/fp-behandling-felles';
import BehandlingspunktAnkeInfoPanel from 'behandlingKlage/src/anke/behandlingsprosess/components/BehandlingspunktAnkeInfoPanel';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta,
  BehandlingIdentifier, getLocationWithQueryParams,
} from '@fpsak-frontend/fp-felles';
import { getResolveFaktaAksjonspunkterSuccess } from 'behandlingKlage/src/anke/fakta/duckFaktaAnke';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import AnkeBehandlingModal from './components/AnkeBehandlingModal';
import {
  setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  getSelectedBehandlingspunktNavn,
  fetchPreviewAnkeBrev,
  resolveKlageTemp,
  saveKlage,
  getResolveProsessAksjonspunkterSuccess,
} from './duckBpAnke';
import {
  getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt,
  getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
}
  from './BehandlingsprosessAnkeSelectors';
import findAnkeIcon from './findAnkeIcon';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());


/**
 * BehandlingsprosessAnkeIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessAnkeIndex extends Component {
  constructor() {
    super();

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToKlageResultat = this.goToKlageResultat.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
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

  goToKlageResultat() {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithQueryParams(location, { punkt: 'default', fakta: 'default' }));
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  previewCallback(data) {
    const { behandlingIdentifier, fetchPreview: fetchBrevPreview } = this.props;
    const brevData = {
      ...data,
      behandlingId: behandlingIdentifier.behandlingId,
    };
    fetchBrevPreview(brevData);
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

  submitVilkar(aksjonspunktModels) {
    const {
      resolveProsessAksjonspunkter: resolveAksjonspunkter,
      behandlingIdentifier, behandlingVersjon,
    } = this.props;
    const models = aksjonspunktModels.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));

    const skalTilMedunderskriver = aksjonspunktModels
      .some(apValue => apValue.kode === aksjonspunktCodes.FORESLA_VEDTAK);
    const skalFerdigstilles = aksjonspunktModels
      .some(apValue => apValue.kode === aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL);
    const erKlageHjemsendt = aksjonspunktModels
      .some(apValue => apValue.kode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE);
    const shouldUpdateInfo = !skalTilMedunderskriver;
    const behandlingId = behandlingIdentifier.$$behandlingId;
    const afterSubmit = () => {
      const { fetchAnkevurdering } = this.props;
      fetchAnkevurdering({ behandlingId });
      if (skalTilMedunderskriver || skalFerdigstilles) {
        this.setShowModalKlageBehandling(true);
      } else if (erKlageHjemsendt) {
        this.goToKlageResultat();
      } else {
        this.goToBehandlingWithDefaultPunktAndFakta();
      }
    };

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
      behandlingspunkter, selectedBehandlingspunkt, isSelectedBehandlingHenlagt, fagsakYtelseType, behandlingIdentifier, innstilling,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess, behandlingStatus, behandlingsresultat, aksjonspunkter, behandlingType,
    } = this.props;
    const { showModalKlageBehandling } = this.state;
    return (
      <React.Fragment>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
          isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
          findBehandlingsprosessIcon={findAnkeIcon}
          getBehandlingspunkterStatus={getBehandlingspunkterStatus}
          getBehandlingspunkterTitleCodes={getBehandlingspunkterTitleCodes}
          getAksjonspunkterOpenStatus={getAksjonspunkterOpenStatus}
        >
          <BehandlingspunktAnkeInfoPanel
            submitCallback={this.submitVilkar}
            previewCallback={this.previewCallback}
            saveTempKlage={this.saveKlageText}
            previewCallbackKlage={this.previewCallback}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
            innstilling={innstilling}
          />
        </BehandlingsprosessPanel>

        <IverksetterVedtakStatusModal
          closeEvent={this.goToSearchPage}
          behandlingsresultat={behandlingsresultat}
          behandlingStatusKode={behandlingStatus.kode}
          fagsakYtelseType={fagsakYtelseType}
          resolveFaktaAksjonspunkterSuccess={resolveFaktaAksjonspunkterSuccess}
          resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        />
        <FatterVedtakStatusModal
          closeEvent={this.goToSearchPage}
          selectedBehandlingId={behandlingIdentifier.behandlingId}
          fagsakYtelseType={fagsakYtelseType}
          isVedtakSubmission={resolveProsessAksjonspunkterSuccess}
          behandlingStatus={behandlingStatus}
          behandlingsresultat={behandlingsresultat}
          aksjonspunkter={aksjonspunkter}
          behandlingType={behandlingType}
        />
        <AnkeBehandlingModal showModal={showModalKlageBehandling} closeEvent={this.goToSearchPage} />
      </React.Fragment>
    );
  }
}

BehandlingsprosessAnkeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  saveKlage: PropTypes.func.isRequired,
  resolveKlageTemp: PropTypes.func.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  fetchPreview: PropTypes.func.isRequired,
  fetchAnkevurdering: PropTypes.func.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  resolveFaktaAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape(),
  innstilling: PropTypes.shape({}),
};

BehandlingsprosessAnkeIndex.defaultProps = {
  behandlingspunkter: undefined,
  selectedBehandlingspunkt: undefined,
  behandlingsresultat: undefined,
  innstilling: {},
};

const mapStateToProps = state => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingspunkter: getBehandlingspunkter(state),
  defaultBehandlingspunkt: getDefaultBehandlingspunkt(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  behandlingType: getBehandlingType(state),
  location: state.router.location,
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingsresultat: getBehandlingsresultat(state),
  resolveFaktaAksjonspunkterSuccess: getResolveFaktaAksjonspunkterSuccess(state),
  innstilling: getResultat(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    fetchPreview: fetchPreviewAnkeBrev,
    fetchAnkevurdering: hentAnkeVurdering,
    resolveProsessAksjonspunkter,
    overrideProsessAksjonspunkter,
    resetBehandlingspunkter,
    saveKlage,
    resolveKlageTemp,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessAnkeIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
