import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { setSubmitFailed as dispatchSubmitFailed } from 'redux-form';
import { createSelector } from 'reselect';

import { trackRouteParam, getRiskPanelLocationCreator } from '@fpsak-frontend/fp-felles';
import {
 getAksjonspunkter, getBehandlingIdentifier, getBehandlingVersjon, getBehandlingAnsvarligSaksbehandler,
} from 'behandling/duck';
import { getNavAnsatt } from 'navAnsatt/duck';

import kontrollresultatKode from '@fpsak-frontend/kodeverk/src/kontrollresultatKode';
import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fpsakApi from '../../data/fpsakApi';
import {
 getKontrollresultat, resolveAksjonspunkter, setRiskPanelOpen, isRiskPanelOpen,
} from './duck';
import IngenRisikoPanel from './components/IngenRisikoPanel';
import ManglendeKlassifiseringPanel from './components/ManglendeKlassifiseringPanel';
import HoyRisikoTittel from './components/HoyRisikoTittel';

const harResultatkode = (risikoklassifisering, resultatkode) => {
  if (!risikoklassifisering || !risikoklassifisering.kontrollresultat) {
    return false;
  }
  return risikoklassifisering.kontrollresultat.kode === resultatkode;
};

const getRisikoaksjonspunkt = createSelector([getAksjonspunkter], aksjonspunkter => (aksjonspunkter
  ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FARESIGNALER)
  : undefined));

/**
 * RisikoklassifiseringIndex
 *
 * Container komponent. Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */

export class RisikoklassifiseringIndexImpl extends Component {
  componentDidMount = () => {
    this.finnKontrollresultat();
  }

  finnKontrollresultat = () => {
    const { behandlingIdentifier, getKontrollresultat: hentResultat } = this.props;

    const params = {
      ...behandlingIdentifier.toJson(),
    };

    hentResultat(params);
  }

  submitAksjonspunkter = (aksjonspunkter) => {
    const {
      behandlingIdentifier,
      behandlingVersjon,
      resolveAksjonspunkter: resolveAp,
    } = this.props;
    const model = aksjonspunkter.map(ap => ({
      '@type': ap.kode,
    ...ap,
    }));

    const params = {
      ...behandlingIdentifier.toJson(),
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: model,
    };

    return resolveAp(
        params,
        behandlingIdentifier,
    );
  }

  toggleRiskPanel = () => {
    const {
      push: pushLocation, location, isPanelOpen, setRiskPanelOpen: setOpen,
    } = this.props;
    pushLocation(getRiskPanelLocationCreator(location)(!isPanelOpen));
    // TODO (TOR) Dette trur eg ikkje skal vera naudsynt. Bør automatisk synce url til store
    setOpen(!isPanelOpen);
  }

  render() {
    const {
    aksjonspunkt,
    risikoklassifisering,
    harHentetKontrollresultat,
    navAnsatt,
    ansvarligSaksbehandler,
    isPanelOpen,
  } = this.props;
  const { brukernavn, kanSaksbehandle } = navAnsatt;
  const readOnly = brukernavn !== ansvarligSaksbehandler || !kanSaksbehandle; // TODO Er denne passende?
  if (!harHentetKontrollresultat) {
    return <ManglendeKlassifiseringPanel />;
  }
  if (harResultatkode(risikoklassifisering, kontrollresultatKode.IKKE_HOY)) {
    return (
      <IngenRisikoPanel />
    );
  }
  if (harResultatkode(risikoklassifisering, kontrollresultatKode.HOY)) {
    return (
      <HoyRisikoTittel
        risikoklassifisering={risikoklassifisering}
        aksjonspunkt={aksjonspunkt}
        readOnly={readOnly}
        submitCallback={this.submitAksjonspunkter}
        isRiskPanelOpen={isPanelOpen}
        toggleRiskPanel={this.toggleRiskPanel}
      />
    );
  }
  return (
    <ManglendeKlassifiseringPanel />
    );
  }
}

RisikoklassifiseringIndexImpl.propTypes = {
  risikoklassifisering: PropTypes.shape(),
  aksjonspunkt: aksjonspunktPropType,
  getKontrollresultat: PropTypes.func.isRequired,
  resolveAksjonspunkter: PropTypes.func.isRequired,
  harHentetKontrollresultat: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.shape().isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  ansvarligSaksbehandler: PropTypes.string,
  push: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  isPanelOpen: PropTypes.bool.isRequired,
  setRiskPanelOpen: PropTypes.func.isRequired,
};

RisikoklassifiseringIndexImpl.defaultProps = {
  risikoklassifisering: undefined,
  aksjonspunkt: undefined,
  ansvarligSaksbehandler: undefined,
};

const mapStateToProps = state => ({
  location: state.router.location,
  harHentetKontrollresultat: fpsakApi.KONTROLLRESULTAT.getRestApiFinished()(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkt: getRisikoaksjonspunkt(state),
  risikoklassifisering: fpsakApi.KONTROLLRESULTAT.getRestApiData()(state),
  navAnsatt: getNavAnsatt(state),
  ansvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  isPanelOpen: isRiskPanelOpen(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    getKontrollresultat,
    dispatchSubmitFailed,
    resolveAksjonspunkter,
    setRiskPanelOpen,
  }, dispatch),
});

export default trackRouteParam({
  paramName: 'risiko',
  parse: isOpen => isOpen === 'true',
  paramPropType: PropTypes.bool,
  storeParam: setRiskPanelOpen,
  getParamFromStore: isRiskPanelOpen,
  isQueryParam: true,
})(connect(mapStateToProps, mapDispatchToProps)(RisikoklassifiseringIndexImpl));
