import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import BehandlingInfoHolder from 'behandlingFelles/BehandlingInfoHolder';
import {
  getBehandlingSprak, getBehandlingVersjon, getBrevMaler, getBrevMottakere, getAksjonspunkter,
  getBehandlingAnsvarligSaksbehandler, getBehandlingStatus, getBehandlingResultatstruktur,
  getBehandlingsresultat, getBehandlingType, getBehandlingHasSoknad,
  getBehandlingIsOnHold, getBehandlingIsQueued, getBehandlingBehandlendeEnhetId,
  getBehandlingBehandlendeEnhetNavn, getHenleggArsaker, getSoknad,
} from './selectors/papirsoknadSelectors';


// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class PapirsoknadInfoSetter extends Component {
  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingSprak, behandlingVersjon, brevMaler, brevMottakere, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus, behandlingResultatstruktur,
      behandlingsresultat, behandlingType, behandlingHasSoknad,
      behandlingIsOnHold, behandlingIsQueued, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, henleggArsaker, soknad,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withBrevMaler(brevMaler)
      .withBrevMottakere(brevMottakere)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingStatus(behandlingStatus)
      .withBehandlingResultatstruktur(behandlingResultatstruktur)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingType(behandlingType)
      .withBehandlingHasSoknad(behandlingHasSoknad)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingIsQueued(behandlingIsQueued)
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

PapirsoknadInfoSetter.propTypes = {
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
  behandlingResultatstruktur: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingType: PropTypes.shape().isRequired,
  behandlingHasSoknad: PropTypes.bool.isRequired,
  behandlingIsOnHold: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
  behandlingBehandlendeEnhetId: PropTypes.string,
  behandlingBehandlendeEnhetNavn: PropTypes.string,
  henleggArsaker: PropTypes.arrayOf(PropTypes.shape({
    valg: PropTypes.string,
  })),
  soknad: PropTypes.shape(),
};

PapirsoknadInfoSetter.defaultProps = {
  behandlingSprak: undefined,
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingAnsvarligSaksbehandler: undefined,
  behandlingResultatstruktur: undefined,
  behandlingsresultat: undefined,
  brevMaler: undefined,
  brevMottakere: undefined,
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  henleggArsaker: null,
  soknad: undefined,
};

const mapStateToProps = state => ({
  behandlingSprak: getBehandlingSprak(state),
  behandlingVersjon: getBehandlingVersjon(state),
  brevMaler: getBrevMaler(state),
  brevMottakere: getBrevMottakere(state),
  aksjonspunkter: getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: getBehandlingStatus(state),
  behandlingResultatstruktur: getBehandlingResultatstruktur(state),
  behandlingsresultat: getBehandlingsresultat(state),
  behandlingType: getBehandlingType(state),
  behandlingHasSoknad: getBehandlingHasSoknad(state),
  behandlingIsOnHold: getBehandlingIsOnHold(state),
  behandlingIsQueued: getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: getBehandlingBehandlendeEnhetNavn(state),
  henleggArsaker: getHenleggArsaker(state),
  soknad: getSoknad(state),
});

export default connect(mapStateToProps)(PapirsoknadInfoSetter);
