import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { withBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getBehandlingIdentifier } from 'behandlingKlage/src/duckBehandlingKlage';
import BehandlingspunktKlageInfoPanel from './components/BehandlingspunktKlageInfoPanel';
import KlageBehandlingModal from './components/klage/KlageBehandlingModal';
import {
  setSelectedBehandlingspunktNavn,
  getSelectedBehandlingspunktNavn,
  saveKlage,
  resolveKlageTemp,
} from './duckBpKlage';

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
    const { submitCallback, goToDefaultPage } = this.props;

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
        goToDefaultPage();
      }
    };

    return submitCallback(aksjonspunktModels, afterAksjonspunktSubmit, shouldUpdateInfo);
  }

  render = () => {
    const { previewCallback, selectedBehandlingspunkt, goToSearchPage } = this.props;
    const { showModalKlageBehandling } = this.state;

    return (
      <>
        <BehandlingspunktKlageInfoPanel
          submitCallback={this.submit}
          saveTempKlage={this.saveKlageText}
          previewCallback={previewCallback}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
        />
        <KlageBehandlingModal showModal={showModalKlageBehandling} closeEvent={goToSearchPage} />
      </>
    );
  }
}

BehandlingsprosessKlageIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  goToDefaultPage: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape(),
  saveKlage: PropTypes.func.isRequired,
  resolveKlageTemp: PropTypes.func.isRequired,
  goToSearchPage: PropTypes.func.isRequired,
};

BehandlingsprosessKlageIndex.defaultProps = {
  location: undefined,
};

const mapStateToProps = (state) => ({
  behandlingIdentifier: getBehandlingIdentifier(state),
});


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    saveKlage,
    resolveKlageTemp,
  }, dispatch),
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(BehandlingsprosessKlageIndex);
export default withBehandlingsprosessIndex(setSelectedBehandlingspunktNavn, getSelectedBehandlingspunktNavn)(connectedComponent);
