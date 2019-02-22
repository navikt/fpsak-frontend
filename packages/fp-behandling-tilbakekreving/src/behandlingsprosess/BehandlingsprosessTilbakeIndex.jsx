import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { replaceNorwegianCharacters } from '@fpsak-frontend/utils';
import aksjonspunktType from '@fpsak-frontend/kodeverk/src/aksjonspunktType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  trackRouteParam, requireProps, getBehandlingspunktLocation, getLocationWithDefaultBehandlingspunktAndFakta, BehandlingIdentifier,
} from '@fpsak-frontend/fp-felles';
import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import TilbakekreveingBehandlingspunktInfoPanel from './components/TilbakekreveingBehandlingspunktInfoPanel';
import {
  setSelectedBehandlingspunktNavn, resolveProsessAksjonspunkter, overrideProsessAksjonspunkter,
  resetBehandlingspunkter, getSelectedBehandlingspunktNavn,
} from './duckBpTilbake';
import {
  getAksjonspunkter, getBehandlingVersjon,
} from '../selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from '../duckTilbake';
import { getBehandlingspunkter, getSelectedBehandlingspunkt, getDefaultBehandlingspunkt }
  from './behandlingsprosessTilbakeSelectors';

const formatBehandlingspunktName = (bpName = '') => replaceNorwegianCharacters(bpName.toLowerCase());

const hasOverstyringAp = aksjonspunkter => (
  aksjonspunkter.some(ap => ap.aksjonspunktType.kode === aksjonspunktType.OVERSTYRING || ap.aksjonspunktType.kode === aksjonspunktType.SAKSBEHANDLEROVERSTYRING)
);

// TODO (TOR) Refaktorer: veldig mykje av dette er felles med andre behandlingstypar. Flytt ut i hooks?

/**
 * BehandlingsprosessTilbakeIndex
 *
 * Container komponent. Har ansvar for behandlingsprosess. Denne bruker valgt
 * fagsak og behandling for å generere opp korrekte behandlingspunkter og tilhørende aksjonspunkter.
 * Er også ansvarlig for alle serverkall. Dvs. henting av data og lagrefunksjonalitet.
 */
export class BehandlingsprosessTilbakeIndex extends Component {
  constructor() {
    super();

    this.setup = this.setup.bind(this);
    this.goToBehandlingspunkt = this.goToBehandlingspunkt.bind(this);
    this.goToBehandlingWithDefaultPunktAndFakta = this.goToBehandlingWithDefaultPunktAndFakta.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.submitVilkar = this.submitVilkar.bind(this);
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

    const afterSubmit = () => {
      this.goToBehandlingWithDefaultPunktAndFakta();
    };

    const aktuelleAksjonspunkter = aksjonspunkter.filter(ap => apCodes.includes(ap.definisjon.kode));
    if (aktuelleAksjonspunkter.length === 0 || hasOverstyringAp(aktuelleAksjonspunkter)) {
      const params = {
        ...behandlingIdentifier.toJson(),
        behandlingVersjon,
        overstyrteAksjonspunktDtoer: models,
      };
      return overrideAksjonspunkter(behandlingIdentifier, params, true)
        .then(afterSubmit);
    }

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: models,
    };
    return resolveAksjonspunkter(behandlingIdentifier, params, true)
      .then(afterSubmit);
  }

  render() {
    const {
      behandlingspunkter, selectedBehandlingspunkt, dispatchSubmitFailed: submitFailedDispatch,
    } = this.props;
    return (
      <>
        <BehandlingsprosessPanel
          behandlingspunkter={behandlingspunkter}
          selectedBehandlingspunkt={selectedBehandlingspunkt}
          selectBehandlingspunktCallback={this.goToBehandlingspunkt}
        >
          <TilbakekreveingBehandlingspunktInfoPanel
            submitCallback={this.submitVilkar}
            dispatchSubmitFailed={submitFailedDispatch}
            selectedBehandlingspunkt={selectedBehandlingspunkt}
          />
        </BehandlingsprosessPanel>
      </>
    );
  }
}

BehandlingsprosessTilbakeIndex.propTypes = {
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
  dispatchSubmitFailed: PropTypes.func.isRequired,
};

BehandlingsprosessTilbakeIndex.defaultProps = {
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
  location: state.router.location,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    resolveProsessAksjonspunkter,
    overrideProsessAksjonspunkter,
    resetBehandlingspunkter,
    dispatchSubmitFailed,
  }, dispatch),
});

const withPropsCheck = requireProps(['behandlingIdentifier', 'behandlingspunkter'], <LoadingPanel />)(BehandlingsprosessTilbakeIndex);
export default trackRouteParam({
  paramName: 'punkt',
  paramPropType: PropTypes.string,
  storeParam: setSelectedBehandlingspunktNavn,
  getParamFromStore: getSelectedBehandlingspunktNavn,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(withPropsCheck));
