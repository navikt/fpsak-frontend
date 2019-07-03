import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import {
  getBehandlingIdentifier, getFagsakYtelseType,
} from 'behandlingInnsyn/src/duckInnsyn';
import findBehandlingsprosessIcon from 'behandlingInnsyn/src/behandlingsprosess/statusIconHelper';
import { BehandlingsprosessPanel, FatterVedtakStatusModal, IverksetterVedtakStatusModal } from '@fpsak-frontend/fp-behandling-felles';
import BehandlingspunktInnsynInfoPanel from 'behandlingInnsyn/src/behandlingsprosess/components/BehandlingspunktInnsynInfoPanel';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import {
  getBehandlingStatus, getBehandlingsresultat, getAksjonspunkter, getBehandlingType, getBehandlingVersjon, getBehandlingHenlagt,
} from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import {
  setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter,
  resetBehandlingspunkter,
  fetchPreviewBrev as fetchPreview,
  getSelectedBehandlingspunktNavn,
  getResolveProsessAksjonspunkterSuccess,
} from './duckBpInnsyn';
import {
  getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt,
  getBehandlingspunkterStatus, getBehandlingspunkterTitleCodes, getAksjonspunkterOpenStatus,
} from './behandlingsprosessInnsynSelectors';


const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

// TODO (TOR) Refaktorer: veldig mykje av dette er felles med andre behandlingstypar. Flytt ut i hooks?

/**
 * BehandlingsprosessInnsynIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessInnsynIndex extends Component {
  constructor() {
    super();

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
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

  submitVilkar(aksjonspunktModels) {
    const {
      resolveProsessAksjonspunkter: resolveAksjonspunkter,
      behandlingIdentifier,
      behandlingVersjon,
    } = this.props;

    const models = aksjonspunktModels.map(ap => ({
      '@type': ap.kode,
      ...ap,
    }));

    const afterSubmit = () => {
      this.goToBehandlingWithDefaultPunktAndFakta();
    };

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: models,
    };

    return resolveAksjonspunkter(behandlingIdentifier, params)
      .then(afterSubmit);
  }

  render() {
    const {
      behandlingspunkter, selectedBehandlingspunkt, isSelectedBehandlingHenlagt, fagsakYtelseType, behandlingIdentifier,
      resolveProsessAksjonspunkterSuccess, behandlingStatus, behandlingsresultat, aksjonspunkter, behandlingType,
    } = this.props;
    return (
      <React.Fragment>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
          isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
          findBehandlingsprosessIcon={findBehandlingsprosessIcon}
          getBehandlingspunkterStatus={getBehandlingspunkterStatus}
          getBehandlingspunkterTitleCodes={getBehandlingspunkterTitleCodes}
          getAksjonspunkterOpenStatus={getAksjonspunkterOpenStatus}
        >
          <BehandlingspunktInnsynInfoPanel
            submitCallback={this.submitVilkar}
            previewCallback={this.previewCallback}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        </BehandlingsprosessPanel>

        <IverksetterVedtakStatusModal
          closeEvent={this.goToSearchPage}
          behandlingsresultat={behandlingsresultat}
          behandlingStatusKode={behandlingStatus.kode}
          fagsakYtelseType={fagsakYtelseType}
          resolveFaktaAksjonspunkterSuccess
          resolveProsessAksjonspunkterSuccess={resolveProsessAksjonspunkterSuccess}
        />
        {behandlingStatus.kode === BehandlingStatus.FATTER_VEDTAK && (
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
        )}
      </React.Fragment>
    );
  }
}

BehandlingsprosessInnsynIndex.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
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
  behandlingType: kodeverkObjektPropType.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

BehandlingsprosessInnsynIndex.defaultProps = {
  behandlingspunkter: undefined,
  selectedBehandlingspunkt: undefined,
  behandlingsresultat: undefined,
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
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    fetchPreview,
    resolveProsessAksjonspunkter,
    resetBehandlingspunkter,
    dispatchSubmitFailed,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessInnsynIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
