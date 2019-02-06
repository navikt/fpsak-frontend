import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType, BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import {
  isKontrollerRevurderingAksjonspunkOpen, getBehandlingSprak, getBehandlingVersjon, getBrevMaler, getBrevMottakere, getAksjonspunkter,
  getBehandlingAnsvarligSaksbehandler, getBehandlingStatus, getBehandlingToTrinnsBehandling, getTotrinnskontrollArsakerUtenUdefinert,
  getTotrinnskontrollArsakerReadOnly, getTotrinnskontrollArsaker, getBehandlingKlageVurdering, getBehandlingIsKlage, getBehandlingResultatstruktur,
  getBehandlingsresultat, getBehandlingType, getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK, getBehandlingHasSoknad,
  getBehandlingIsInnsyn, getBehandlingIsOnHold, isBehandlingInInnhentSoknadsopplysningerSteg, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getHenleggArsaker, getSoknad,
} from './behandlingSelectors';
import { getBehandlingsresultatFraOriginalBehandling, getResultatstrukturFraOriginalBehandling } from './selectors/originalBehandlingSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpSakBehandlingInfoSetter extends Component {
  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingSprak, behandlingVersjon, brevMaler, brevMottakere, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus, behandlingToTrinnsBehandling, totrinnskontrollArsakerUtenUdefinert,
      totrinnskontrollArsakerReadOnly, totrinnskontrollArsaker, behandlingKlageVurdering, behandlingIsKlage, behandlingResultatstruktur,
      behandlingsresultat, behandlingType, behandlingKlageVurderingResultatNFP, behandlingKlageVurderingResultatNK, behandlingHasSoknad,
      behandlingIsInnsyn, behandlingIsOnHold, isBehandlingInInnhentSoknadsinfoSteg, behandlingIsQueued, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, henleggArsaker, soknad, behandlingsresultatFraOriginalBehandling, resultatstrukturFraOriginalBehandling,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withBrevMaler(brevMaler)
      .withBrevMottakere(brevMottakere)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingToTrinnsBehandling(behandlingToTrinnsBehandling)
      .withTotrinnskontrollArsakerUtenUdefinert(totrinnskontrollArsakerUtenUdefinert)
      .withTotrinnskontrollArsakerReadOnly(totrinnskontrollArsakerReadOnly)
      .withTotrinnskontrollArsaker(totrinnskontrollArsaker)
      .withBehandlingKlageVurdering(behandlingKlageVurdering)
      .withBehandlingIsKlage(behandlingIsKlage)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
      .withBehandlingKlageVurderingResultatNFP(behandlingKlageVurderingResultatNFP)
      .withBehandlingKlageVurderingResultatNK(behandlingKlageVurderingResultatNK)
      .withBehandlingHasSoknad(behandlingHasSoknad)
      .withBehandlingIsInnsyn(behandlingIsInnsyn)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withIsBehandlingInInnhentSoknadsopplysningerSteg(isBehandlingInInnhentSoknadsinfoSteg)
      .withBehandlingIsQueued(behandlingIsQueued)
      .withBehandlingBehandlendeEnhetId(behandlingBehandlendeEnhetId)
      .withBehandlendeEnhetNavn(behandlingBehandlendeEnhetNavn)
      .withHenleggArsaker(henleggArsaker)
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
  brevMottakere: PropTypes.arrayOf(PropTypes.string),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingAnsvarligSaksbehandler: PropTypes.string,
  behandlingStatus: PropTypes.shape().isRequired,
  behandlingToTrinnsBehandling: PropTypes.bool.isRequired,
  totrinnskontrollArsakerUtenUdefinert: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollArsakerReadOnly: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollArsaker: PropTypes.arrayOf(PropTypes.shape()),
  behandlingKlageVurdering: PropTypes.shape(),
  behandlingIsKlage: PropTypes.bool,
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingKlageVurderingResultatNFP: PropTypes.shape(),
  behandlingKlageVurderingResultatNK: PropTypes.shape(),
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsInnsyn: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  isBehandlingInInnhentSoknadsinfoSteg: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
  behandlingBehandlendeEnhetId: PropTypes.string,
  behandlingBehandlendeEnhetNavn: PropTypes.string,
  henleggArsaker: PropTypes.arrayOf(PropTypes.shape({
    valg: PropTypes.string,
  })),
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
  behandlingIsKlage: false,
  behandlingResultatstruktur: undefined,
  behandlingsresultat: undefined,
  behandlingKlageVurdering: undefined,
  behandlingKlageVurderingResultatNFP: undefined,
  behandlingKlageVurderingResultatNK: undefined,
  brevMaler: undefined,
  brevMottakere: undefined,
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  henleggArsaker: null,
  soknad: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = state => ({
  isKontrollerRevurderingApOpen: isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingSprak: getBehandlingSprak(state),
  behandlingVersjon: getBehandlingVersjon(state),
  brevMaler: getBrevMaler(state),
  brevMottakere: getBrevMottakere(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingToTrinnsBehandling: getBehandlingToTrinnsBehandling(state),
  totrinnskontrollArsakerUtenUdefinert: getTotrinnskontrollArsakerUtenUdefinert(state),
  totrinnskontrollArsakerReadOnly: getTotrinnskontrollArsakerReadOnly(state),
  totrinnskontrollArsaker: getTotrinnskontrollArsaker(state),
  behandlingKlageVurdering: getBehandlingKlageVurdering(state),
  behandlingIsKlage: getBehandlingIsKlage(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingType: getBehandlingType(state),
  behandlingKlageVurderingResultatNFP: getBehandlingKlageVurderingResultatNFP(state),
  behandlingKlageVurderingResultatNK: getBehandlingKlageVurderingResultatNK(state),
  behandlingHasSoknad: getBehandlingHasSoknad(state),
  behandlingIsInnsyn: getBehandlingIsInnsyn(state),
  behandlingIsOnHold: getBehandlingIsOnHold(state),
  isBehandlingInInnhentSoknadsinfoSteg: isBehandlingInInnhentSoknadsopplysningerSteg(state),
  behandlingIsQueued: getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  henleggArsaker: getHenleggArsaker(state),
  soknad: getSoknad(state),
  behandlingsresultatFraOriginalBehandling: getBehandlingsresultatFraOriginalBehandling(state),
  resultatstrukturFraOriginalBehandling: getResultatstrukturFraOriginalBehandling(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
