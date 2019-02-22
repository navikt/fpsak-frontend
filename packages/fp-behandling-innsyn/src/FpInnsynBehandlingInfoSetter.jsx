import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import {
  getBehandlingSprak, getBehandlingVersjon, getAksjonspunkter, getBehandlingAnsvarligSaksbehandler, getBehandlingStatus,
  getBehandlingsresultat, getBehandlingType, getBehandlingHasSoknad,
  getBehandlingIsOnHold, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getHenleggArsaker, getSoknad,
} from './selectors/innsynBehandlingSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpInnsynBehandlingInfoSetter extends Component {
  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingSprak, behandlingVersjon, aksjonspunkter, behandlingAnsvarligSaksbehandler, behandlingStatus,
      behandlingsresultat, behandlingType, behandlingHasSoknad, behandlingIsOnHold, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, henleggArsaker, soknad,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
      .withBehandlingHasSoknad(behandlingHasSoknad)
      .withBehandlingIsInnsyn(true)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingBehandlendeEnhetId(behandlingBehandlendeEnhetId)
      .withBehandlendeEnhetNavn(behandlingBehandlendeEnhetNavn)
      .withHenleggArsaker(henleggArsaker)
      .withSoknad(soknad));
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

FpInnsynBehandlingInfoSetter.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingSprak: PropTypes.shape(),
  behandlingVersjon: PropTypes.number,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingAnsvarligSaksbehandler: PropTypes.string,
  behandlingStatus: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  behandlingBehandlendeEnhetId: PropTypes.string,
  behandlingBehandlendeEnhetNavn: PropTypes.string,
  henleggArsaker: PropTypes.arrayOf(PropTypes.shape({
    valg: PropTypes.string,
  })),
  soknad: PropTypes.shape(),
};

FpInnsynBehandlingInfoSetter.defaultProps = {
  behandlingSprak: undefined,
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingAnsvarligSaksbehandler: undefined,
  behandlingsresultat: undefined,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  henleggArsaker: null,
  soknad: undefined,
};

const mapStateToProps = state => ({
  behandlingSprak: getBehandlingSprak(state),
  behandlingVersjon: getBehandlingVersjon(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingType: getBehandlingType(state),
  behandlingHasSoknad: getBehandlingHasSoknad(state),
  behandlingIsOnHold: getBehandlingIsOnHold(state),
  behandlingBehandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  henleggArsaker: getHenleggArsaker(state),
  soknad: getSoknad(state),
});

export default connect(mapStateToProps)(FpInnsynBehandlingInfoSetter);
