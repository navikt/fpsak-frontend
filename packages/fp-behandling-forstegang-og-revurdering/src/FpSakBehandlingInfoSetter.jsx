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
      setBehandlingInfoHolder, isKontrollerRevurderingApOpen, behandlingVersjon, aksjonspunkter,
      behandlingResultatstruktur, behandlingsresultat,
      soknad, behandlingsresultatFraOriginalBehandling,
      resultatstrukturFraOriginalBehandling, erArsakTypeBehandlingEtterKlage,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withIsKontrollerRevurderingAksjonspunkOpen(isKontrollerRevurderingApOpen)
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
      .withBehandlingsresultat(behandlingsresultat)
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
  behandlingVersjon: PropTypes.number,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  erArsakTypeBehandlingEtterKlage: PropTypes.bool.isRequired,
  soknad: PropTypes.shape(),
  behandlingsresultatFraOriginalBehandling: PropTypes.shape(),
  resultatstrukturFraOriginalBehandling: PropTypes.shape(),
};

FpSakBehandlingInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingResultatstruktur: undefined,
  behandlingsresultat: undefined,
  soknad: undefined,
  behandlingsresultatFraOriginalBehandling: undefined,
  resultatstrukturFraOriginalBehandling: undefined,
};

const mapStateToProps = (state) => ({
  isKontrollerRevurderingApOpen: behandlingSelectors.isKontrollerRevurderingAksjonspunkOpen(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  soknad: behandlingSelectors.getSoknad(state),
  behandlingsresultatFraOriginalBehandling: getBehandlingsresultatFraOriginalBehandling(state),
  resultatstrukturFraOriginalBehandling: getResultatstrukturFraOriginalBehandling(state),
  erArsakTypeBehandlingEtterKlage: erEtterKlage(state),
});

export default connect(mapStateToProps)(FpSakBehandlingInfoSetter);
