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
      behandlingAnsvarligSaksbehandler, behandlingToTrinnsBehandling, behandlingResultatstruktur, behandlingsresultat,
      behandlingIsOnHold, behandlingIsQueued, soknad, behandlingsresultatFraOriginalBehandling,
      resultatstrukturFraOriginalBehandling, erArsakTypeBehandlingEtterKlage,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingToTrinnsBehandling(behandlingToTrinnsBehandling)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingIsQueued(behandlingIsQueued)
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
  behandlingToTrinnsBehandling: PropTypes.bool.isRequired,
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingIsOnHold: PropTypes.bool.isRequired,
  erArsakTypeBehandlingEtterKlage: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
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
  behandlingToTrinnsBehandling: behandlingSelectors.getBehandlingToTrinnsBehandling(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingIsOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  behandlingIsQueued: behandlingSelectors.getBehandlingIsQueued(state),
  soknad: behandlingSelectors.getSoknad(state),
  behandlingsresultatFraOriginalBehandling: getBehandlingsresultatFraOriginalBehandling(state),
  resultatstrukturFraOriginalBehandling: getResultatstrukturFraOriginalBehandling(state),
  erArsakTypeBehandlingEtterKlage: erEtterKlage(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
