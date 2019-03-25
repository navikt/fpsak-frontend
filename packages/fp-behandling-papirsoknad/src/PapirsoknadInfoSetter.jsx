import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';
import {
  getBehandlingSprak, getBehandlingVersjon, getBrevMaler, getAksjonspunkter,
  getBehandlingAnsvarligSaksbehandler, getBehandlingStatus,
  getBehandlingsresultat, getBehandlingType, getBehandlingHasSoknad,
  getBehandlingIsOnHold, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getSoknad,
} from './selectors/papirsoknadSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class PapirsoknadInfoSetter extends Component {
  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingSprak, behandlingVersjon, brevMaler, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus,
      behandlingsresultat, behandlingType, behandlingHasSoknad,
      behandlingIsOnHold, behandlingIsQueued, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, soknad,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withBrevMaler(brevMaler)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
      .withBehandlingHasSoknad(behandlingHasSoknad)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingIsQueued(behandlingIsQueued)
      .withBehandlingBehandlendeEnhetId(behandlingBehandlendeEnhetId)
      .withBehandlendeEnhetNavn(behandlingBehandlendeEnhetNavn)
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

PapirsoknadInfoSetter.propTypes = {
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
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
  behandlingBehandlendeEnhetId: PropTypes.string,
  behandlingBehandlendeEnhetNavn: PropTypes.string,
  soknad: PropTypes.shape(),
};

PapirsoknadInfoSetter.defaultProps = {
  behandlingSprak: undefined,
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingAnsvarligSaksbehandler: undefined,
  behandlingsresultat: undefined,
  brevMaler: undefined,
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  soknad: undefined,
};

const mapStateToProps = state => ({
  behandlingSprak: getBehandlingSprak(state),
  behandlingVersjon: getBehandlingVersjon(state),
  brevMaler: getBrevMaler(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingType: getBehandlingType(state),
  behandlingHasSoknad: getBehandlingHasSoknad(state),
  behandlingIsOnHold: getBehandlingIsOnHold(state),
  behandlingIsQueued: getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  soknad: getSoknad(state),
});

export default connect(mapStateToProps)(PapirsoknadInfoSetter);
