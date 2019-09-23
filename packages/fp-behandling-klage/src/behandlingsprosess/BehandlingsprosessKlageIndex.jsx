import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingIdentifier, getLocationWithQueryParams, trackRouteParam } from '@fpsak-frontend/fp-felles';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingKlage/src/duckBehandlingKlage';
import BehandlingspunktKlageInfoPanel from './components/BehandlingspunktKlageInfoPanel';
import KlageBehandlingModal from './components/klage/KlageBehandlingModal';
import behandlingSelectors from '../selectors/klageBehandlingSelectors';
import {
  fetchPreviewKlageBrev,
  getResolveProsessAksjonspunkterSuccess,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  resolveProsessAksjonspunkter,
  getSelectedBehandlingspunktNavn,
  resolveKlageTemp,
  saveKlage,
  setSelectedBehandlingspunktNavn,
} from './duckBpKlage';
import behandlingsprosessKlageSelectors from './selectors/behandlingsprosessKlageSelectors';

/**
 * BehandlingsprosessKlageIndex
 *
 * Har ansvar for behandlingsprosessdelen av hovedvinduet når behandlingstypen er Klage.
 */
export class BehandlingsprosessKlageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalKlageBehandling: false,
    };
  }

  setShowModalKlageBehandling = (showModal) => {
    this.setState({
      showModalKlageBehandling: showModal,
    });
  }

  goToKlageResultat = () => {
    const { push: pushLocation, location } = this.props;
    pushLocation(getLocationWithQueryParams(location, { punkt: 'resultat', fakta: 'default' }));
  }

  saveKlageText = (aksjonspunktModel, shouldReopenAp) => {
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

  submit = (aksjonspunktModels) => {
    const skalByttTilKlageinstans = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP && apValue.klageVurdering === klageVurdering.STADFESTE_YTELSESVEDTAK);
    const erKlageHjemsendt = aksjonspunktModels
      .some((apValue) => apValue.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK && apValue.klageVurdering === klageVurdering.HJEMSENDE_UTEN_Å_OPPHEVE);

    const shouldUpdateInfo = !skalByttTilKlageinstans;

    const afterAksjonspunktSubmit = () => {
      if (skalByttTilKlageinstans) {
        this.setShowModalKlageBehandling(true);
      } else if (erKlageHjemsendt) {
        this.goToKlageResultat();
      } else {
        this.goToDefaultPage();
      }
    };

    return this.submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, shouldUpdateInfo);
  }

  getSubmit = (submitCallback, goToDefaultPage) => {
    this.submitCallback = submitCallback;
    this.goToDefaultPage = goToDefaultPage;
    return this.submit;
  }

  render = () => {
    const {
      selectedBehandlingspunkt, aksjonspunkter, aksjonspunkterOpenStatus, behandlingIdentifier, behandlingspunkter,
      resolveProsessAksjonspunkterSuccess, behandlingspunkterStatus, behandlingspunkterTitleCodes, behandlingsresultat,
      behandlingStatus, behandlingType, behandlingVersjon, fagsakYtelseType, fetchPreviewBrev, isSelectedBehandlingHenlagt,
      location, behandlingUuid,
    } = this.props;
    const { showModalKlageBehandling } = this.state;

    return (
      <CommonBehandlingsprosessIndex
        aksjonspunkter={aksjonspunkter}
        behandlingUuid={behandlingUuid}
        aksjonspunkterOpenStatus={aksjonspunkterOpenStatus}
        behandlingIdentifier={behandlingIdentifier}
        behandlingspunkter={behandlingspunkter}
        selectedBehandlingspunkt={selectedBehandlingspunkt}
        behandlingspunkterStatus={behandlingspunkterStatus}
        behandlingspunkterTitleCodes={behandlingspunkterTitleCodes}
        behandlingsresultat={behandlingsresultat}
        behandlingStatus={behandlingStatus}
        behandlingType={behandlingType}
        behandlingVersjon={behandlingVersjon}
        fagsakYtelseType={fagsakYtelseType}
        fetchPreviewBrev={fetchPreviewBrev}
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        location={location}
        resetBehandlingspunkter={resetBehandlingspunkter}
        resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
        resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        overrideProsessAksjonspunkter={overrideProsessAksjonspunkter}
        render={(previewCallback, submitCallback, goToDefaultPage, goToSearchPage) => (
          <>
            <BehandlingspunktKlageInfoPanel
              submitCallback={this.getSubmit(submitCallback, goToDefaultPage)}
              saveTempKlage={this.saveKlageText}
              previewCallback={previewCallback}
              selectedBehandlingspunkt={selectedBehandlingspunkt}
            />
            <KlageBehandlingModal showModal={showModalKlageBehandling} closeEvent={goToSearchPage} />
          </>
        )}
      />
    );
  }
}

BehandlingsprosessKlageIndex.propTypes = {
  behandlingUuid: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  push: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  resolveKlageTemp: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  behandlingUuid: behandlingSelectors.getBehandlingUuid(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingsprosessKlageSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingsprosessKlageSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingsprosessKlageSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingsprosessKlageSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingsprosessKlageSelectors.getAksjonspunkterOpenStatus(state),
  fetchPreviewBrev: fetchPreviewKlageBrev,
  location: state.router.location,
  resolveProsessAksjonspunkter,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    saveKlage,
    resolveKlageTemp,
  }, dispatch),
});

const TrackRouteParamBehandlingsprosessIndex = trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessKlageIndex));

export default TrackRouteParamBehandlingsprosessIndex;
