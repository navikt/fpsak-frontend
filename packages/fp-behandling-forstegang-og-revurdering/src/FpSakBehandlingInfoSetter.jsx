import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
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
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingVersjon,
      behandlingResultatstruktur, behandlingsresultat,
      behandlingsresultatFraOriginalBehandling,
      resultatstrukturFraOriginalBehandling, erArsakTypeBehandlingEtterKlage,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingVersjon(behandlingVersjon)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
      .withBehandlingsresultat(behandlingsresultat)
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
  behandlingVersjon: PropTypes.number,
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  erArsakTypeBehandlingEtterKlage: PropTypes.bool.isRequired,
  behandlingsresultatFraOriginalBehandling: PropTypes.shape(),
  resultatstrukturFraOriginalBehandling: PropTypes.shape(),
};

FpSakBehandlingInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
  behandlingResultatstruktur: undefined,
  behandlingsresultat: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = (state) => ({
  isKontrollerRevurderingApOpen: behandlingSelectors.isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingsresultatFraOriginalBehandling: getBehandlingsresultatFraOriginalBehandling(state),
  resultatstrukturFraOriginalBehandling: getResultatstrukturFraOriginalBehandling(state),
  erArsakTypeBehandlingEtterKlage: erEtterKlage(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
