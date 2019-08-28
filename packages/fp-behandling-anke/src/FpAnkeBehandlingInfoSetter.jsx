import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import behandlingSelectors from './selectors/ankeBehandlingSelectors';

// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpSakBehandlingInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingSprak, behandlingVersjon, brevMaler, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus, behandlingToTrinnsBehandling, totrinnskontrollArsakerUtenUdefinert,
      totrinnskontrollArsakerReadOnly, totrinnskontrollArsaker, behandlingsresultat, behandlingType, behandlingHasSoknad,
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
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
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
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
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
  brevMaler: undefined,
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  soknad: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = (state) => ({
  isKontrollerRevurderingApOpen: behandlingSelectors.isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingSprak: behandlingSelectors.getBehandlingSprak(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  brevMaler: behandlingSelectors.getBrevMaler(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: behandlingSelectors.getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingToTrinnsBehandling: behandlingSelectors.getBehandlingToTrinnsBehandling(state),
  totrinnskontrollArsakerUtenUdefinert: behandlingSelectors.getTotrinnskontrollArsakerUtenUdefinert(state),
  totrinnskontrollArsakerReadOnly: behandlingSelectors.getTotrinnskontrollArsakerReadOnly(state),
  totrinnskontrollArsaker: behandlingSelectors.getTotrinnskontrollArsaker(state),
  behandlingAnkeVurdering: behandlingSelectors.getBehandlingAnkeVurdering(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  behandlingAnkeVurderingResultat: behandlingSelectors.getBehandlingAnkeVurderingResultat(state),
  behandlingHasSoknad: behandlingSelectors.getBehandlingHasSoknad(state),
  behandlingIsOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  isBehandlingInInnhentSoknadsinfoSteg: behandlingSelectors.isBehandlingInInnhentSoknadsopplysningerSteg(state),
  behandlingIsQueued: behandlingSelectors.getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: behandlingSelectors.getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: behandlingSelectors.getBehandlingBehandlendeEnhetNavn(state),
  soknad: behandlingSelectors.getSoknad(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
