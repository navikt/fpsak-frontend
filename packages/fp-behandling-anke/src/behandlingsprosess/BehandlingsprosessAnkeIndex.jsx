import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import { BehandlingsprosessPanel, IverksetterVedtakStatusModal } from '@fpsak-frontend/fp-behandling-felles';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta,
  BehandlingIdentifier, getLocationWithQueryParams,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  getBehandlingVersjon, getBehandlingStatus, getBehandlingsresultat, getBehandlingHenlagt,
  getBehandlingAnkeVurderingResultat,
} from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingAnke/src/duckAnke';
import { getResolveFaktaAksjonspunkterSuccess } from 'behandlingAnke/src/fakta/duckFaktaAnke';
import BehandlingspunktAnkeInfoPanel from './components/BehandlingspunktAnkeInfoPanel';
import AnkeBehandlingModal from './components/AnkeBehandlingModal';
import {
  setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
  getSelectedBehandlingspunktNavn,
  fetchPreviewAnkeBrev,
  resolveAnkeTemp,
  saveAnke,
  getResolveProsessAksjonspunkterSuccess,
} from './duckBpAnke';
import {
  getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt,
  getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
} from './BehandlingsprosessAnkeSelectors';
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
    this.goToAnkeResultat = this.goToAnkeResultat.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
    this.setShowModalAnkeBehandling = this.setShowModalAnkeBehandling.bind(this);
    this.saveAnkeText = this.saveAnkeText.bind(this);

    this.state = {
      showModalAnkeBehandling: false,
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

  setShowModalAnkeBehandling(showModal) {
    this.setState({
      showModalAnkeBehandling: showModal,
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

  goToAnkeResultat() {
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

  saveAnkeText(aksjonspunktModel, shouldReopenAp) {
    const { behandlingIdentifier, saveAnke: saveTempAnke, resolveAnkeTemp: resolveAnke } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      ...aksjonspunktModel,
    };
    if (shouldReopenAp) {
      resolveAnke(behandlingIdentifier, data);
    } else {
      saveTempAnke(data);
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
    const erAnkeHjemsendt = aksjonspunktModels
      .some(apValue => apValue.kode === aksjonspunktCodes.MANUELL_VURDERING_AV_ANKE);
    const shouldUpdateInfo = !skalTilMedunderskriver;
    const afterSubmit = () => {
      if (skalTilMedunderskriver || skalFerdigstilles) {
        this.setShowModalAnkeBehandling(true);
      } else if (erAnkeHjemsendt) {
        this.goToAnkeResultat();
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
      behandlingspunkter, selectedBehandlingspunkt, isSelectedBehandlingHenlagt, fagsakYtelseType, innstilling,
      resolveProsessAksjonspunkterSuccess, resolveFaktaAksjonspunkterSuccess, behandlingStatus, behandlingsresultat,
    } = this.props;
    const { showModalAnkeBehandling } = this.state;
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
            saveTempAnke={this.saveAnkeText}
            previewCallbackAnke={this.previewCallback}
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
        <AnkeBehandlingModal showModal={showModalAnkeBehandling} closeEvent={this.goToSearchPage} />
      </React.Fragment>
    );
  }
}

BehandlingsprosessAnkeIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  saveAnke: PropTypes.func.isRequired,
  resolveAnkeTemp: PropTypes.func.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  push: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  fetchPreview: PropTypes.func.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
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
  behandlingspunkter: getBehandlingspunkter(state),
  defaultBehandlingspunkt: getDefaultBehandlingspunkt(state),
  selectedBehandlingspunkt: getSelectedBehandlingspunkt(state),
  location: state.router.location,
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingsresultat: getBehandlingsresultat(state),
  resolveFaktaAksjonspunkterSuccess: getResolveFaktaAksjonspunkterSuccess(state),
  innstilling: getBehandlingAnkeVurderingResultat(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    fetchPreview: fetchPreviewAnkeBrev,
    resolveProsessAksjonspunkter,
    resetBehandlingspunkter,
    saveAnke,
    resolveAnkeTemp,
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
