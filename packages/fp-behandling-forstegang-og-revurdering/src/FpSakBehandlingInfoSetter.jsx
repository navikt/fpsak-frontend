import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { getBehandlingResultatstruktur, erArsakTypeBehandlingEtterKlage as erEtterKlage } from './behandlingSelectors';
import behandlingSelectors from './selectors/forsteOgRevBehandlingSelectors';
import { getBehandlingsresultatFraOriginalBehandling, getResultatstrukturFraOriginalBehandling } from './selectors/originalBehandlingSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpSakBehandlingInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingSprak, behandlingVersjon, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus, behandlingToTrinnsBehandling, behandlingResultatstruktur, behandlingsresultat,
      behandlingType, behandlingHasSoknad, behandlingIsOnHold, isBehandlingInInnhentSoknadsinfoSteg, behandlingIsQueued,
      behandlingBehandlendeEnhetId, behandlingBehandlendeEnhetNavn, soknad, behandlingsresultatFraOriginalBehandling,
      resultatstrukturFraOriginalBehandling, erArsakTypeBehandlingEtterKlage,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingToTrinnsBehandling(behandlingToTrinnsBehandling)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
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
      .withResultatstrukturFraOriginalBehandling(resultatstrukturFraOriginalBehandling)
      .withErArsakTypeBehandlingEtterKlage(erArsakTypeBehandlingEtterKlage));
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
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingAnsvarligSaksbehandler: PropTypes.string,
  behandlingStatus: PropTypes.shape().isRequired,
  behandlingToTrinnsBehandling: PropTypes.bool.isRequired,
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  isBehandlingInInnhentSoknadsinfoSteg: PropTypes.bool.isRequired,
  erArsakTypeBehandlingEtterKlage: PropTypes.bool.isRequired,
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
  behandlingResultatstruktur: undefined,
  behandlingsresultat: undefined,
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
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: behandlingSelectors.getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingToTrinnsBehandling: behandlingSelectors.getBehandlingToTrinnsBehandling(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  behandlingHasSoknad: behandlingSelectors.getBehandlingHasSoknad(state),
  behandlingIsOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  isBehandlingInInnhentSoknadsinfoSteg: behandlingSelectors.isBehandlingInInnhentSoknadsopplysningerSteg(state),
  behandlingIsQueued: behandlingSelectors.getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: behandlingSelectors.getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: behandlingSelectors.getBehandlingBehandlendeEnhetNavn(state),
  soknad: behandlingSelectors.getSoknad(state),
  behandlingsresultatFraOriginalBehandling: getBehandlingsresultatFraOriginalBehandling(state),
  resultatstrukturFraOriginalBehandling: getResultatstrukturFraOriginalBehandling(state),
  erArsakTypeBehandlingEtterKlage: erEtterKlage(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
