import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import {
  isKontrollerRevurderingAksjonspunkOpen, getBehandlingSprak, getBehandlingVersjon, getBrevMaler, getAksjonspunkter,
  getBehandlingAnsvarligSaksbehandler, getBehandlingStatus, getBehandlingToTrinnsBehandling, getTotrinnskontrollArsakerUtenUdefinert,
  getTotrinnskontrollArsakerReadOnly, getTotrinnskontrollArsaker, getBehandlingKlageVurdering,
  getBehandlingsresultat, getBehandlingType, getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK, getBehandlingHasSoknad,
  getBehandlingIsOnHold, isBehandlingInInnhentSoknadsopplysningerSteg, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getSoknad,
} from './selectors/klageBehandlingSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpSakBehandlingInfoSetter extends Component {
  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingSprak, behandlingVersjon, brevMaler, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus, behandlingToTrinnsBehandling, totrinnskontrollArsakerUtenUdefinert,
      totrinnskontrollArsakerReadOnly, totrinnskontrollArsaker, behandlingKlageVurdering,
      behandlingsresultat, behandlingType, behandlingKlageVurderingResultatNFP, behandlingKlageVurderingResultatNK, behandlingHasSoknad,
      behandlingIsOnHold, isBehandlingInInnhentSoknadsinfoSteg, behandlingIsQueued, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, soknad, behandlingsresultatFraOriginalBehandling, resultatstrukturFraOriginalBehandling,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withBrevMaler(brevMaler)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingToTrinnsBehandling(behandlingToTrinnsBehandling)
      .withTotrinnskontrollArsakerUtenUdefinert(totrinnskontrollArsakerUtenUdefinert)
      .withTotrinnskontrollArsakerReadOnly(totrinnskontrollArsakerReadOnly)
      .withTotrinnskontrollArsaker(totrinnskontrollArsaker)
      .withBehandlingKlageVurdering(behandlingKlageVurdering)
      .withBehandlingIsKlage(true)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
      .withBehandlingKlageVurderingResultatNFP(behandlingKlageVurderingResultatNFP)
      .withBehandlingKlageVurderingResultatNK(behandlingKlageVurderingResultatNK)
      .withBehandlingHasSoknad(behandlingHasSoknad)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withIsBehandlingInInnhentSoknadsopplysningerSteg(isBehandlingInInnhentSoknadsinfoSteg)
      .withBehandlingIsQueued(behandlingIsQueued)
      .withBehandlingBehandlendeEnhetId(behandlingBehandlendeEnhetId)
      .withBehandlendeEnhetNavn(behandlingBehandlendeEnhetNavn)
      .withSoknad(soknad)
      .withBehandlingsresultatFraOriginalBehandling(behandlingsresultatFraOriginalBehandling)
      .withResultatstrukturFraOriginalBehandling(resultatstrukturFraOriginalBehandling));
  }

  componentWillMount = () => {
    this.setBehandlingInfo();
  }

  componentDidUpdate = (prevProps) => {
    const { behandlingVersjon } = this.props;

    if (prevProps.behandlingVersjon !== behandlingVersjon) {
      this.setBehandlingInfo();
    }
  }

  render =() => null
}

FpSakBehandlingInfoSetter.propTypes = {
  isKontrollerRevurderingApOpen: PropTypes.bool.isRequired,
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingSprak: PropTypes.shape(),
  behandlingVersjon: PropTypes.number,
  brevMaler: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    tilgjengelig: PropTypes.bool.isRequired,
  })),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingAnsvarligSaksbehandler: PropTypes.string,
  behandlingStatus: PropTypes.shape().isRequired,
  behandlingToTrinnsBehandling: PropTypes.bool.isRequired,
  totrinnskontrollArsakerUtenUdefinert: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollArsakerReadOnly: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollArsaker: PropTypes.arrayOf(PropTypes.shape()),
  behandlingKlageVurdering: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingKlageVurderingResultatNFP: PropTypes.shape(),
  behandlingKlageVurderingResultatNK: PropTypes.shape(),
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  isBehandlingInInnhentSoknadsinfoSteg: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
  behandlingBehandlendeEnhetId: PropTypes.string,
  behandlingBehandlendeEnhetNavn: PropTypes.string,
  soknad: PropTypes.shape(),
  behandlingsresultatFraOriginalBehandling: PropTypes.shape(),
  resultatstrukturFraOriginalBehandling: PropTypes.shape(),
};

FpSakBehandlingInfoSetter.defaultProps = {
  behandlingSprak: undefined,
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingAnsvarligSaksbehandler: undefined,
  totrinnskontrollArsakerUtenUdefinert: undefined,
  totrinnskontrollArsakerReadOnly: undefined,
  totrinnskontrollArsaker: [],
  behandlingsresultat: undefined,
  behandlingKlageVurdering: undefined,
  behandlingKlageVurderingResultatNFP: undefined,
  behandlingKlageVurderingResultatNK: undefined,
  brevMaler: undefined,
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  soknad: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = state => ({
  isKontrollerRevurderingApOpen: isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingSprak: getBehandlingSprak(state),
  behandlingVersjon: getBehandlingVersjon(state),
  brevMaler: getBrevMaler(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingToTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
  totrinnskontrollArsakerUtenUdefinert: getTotrinnskontrollArsakerUtenUdefinert(state),
  totrinnskontrollArsakerReadOnly: getTotrinnskontrollArsakerReadOnly(state),
  totrinnskontrollArsaker: getTotrinnskontrollArsaker(state),
  behandlingKlageVurdering: getBehandlingKlageVurdering(state),
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingType: getBehandlingType(state),
  behandlingKlageVurderingResultatNFP: getBehandlingKlageVurderingResultatNFP(state),
  behandlingKlageVurderingResultatNK: getBehandlingKlageVurderingResultatNK(state),
  behandlingHasSoknad: getBehandlingHasSoknad(state),
  behandlingIsOnHold: getBehandlingIsOnHold(state),
  isBehandlingInInnhentSoknadsinfoSteg: isBehandlingInInnhentSoknadsopplysningerSteg(state),
  behandlingIsQueued: getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  soknad: getSoknad(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
