import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/papirsoknadSelectors';

// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class PapirsoknadInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingSprak, behandlingVersjon, aksjonspunkter,
      behandlingAnsvarligSaksbehandler, behandlingStatus,
      behandlingsresultat, behandlingType, behandlingHasSoknad,
      behandlingIsOnHold, behandlingIsQueued, behandlingBehandlendeEnhetId,
      behandlingBehandlendeEnhetNavn, soknad,
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
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingIsQueued(behandlingIsQueued)
      .withBehandlingBehandlendeEnhetId(behandlingBehandlendeEnhetId)
      .withBehandlendeEnhetNavn(behandlingBehandlendeEnhetNavn)
      .withSoknad(soknad));
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
  behandlingIsQueued: false,
  behandlingBehandlendeEnhetId: undefined,
  behandlingBehandlendeEnhetNavn: undefined,
  soknad: undefined,
};

const mapStateToProps = (state) => ({
  behandlingSprak: behandlingSelectors.getBehandlingSprak(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: behandlingSelectors.getBehandlingAnsvarligSaksbehandler(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  behandlingHasSoknad: behandlingSelectors.getBehandlingHasSoknad(state),
  behandlingIsOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  behandlingIsQueued: behandlingSelectors.getBehandlingIsQueued(state),
  behandlingBehandlendeEnhetId: behandlingSelectors.getBehandlingBehandlendeEnhetId(state),
  behandlingBehandlendeEnhetNavn: behandlingSelectors.getBehandlingBehandlendeEnhetNavn(state),
  soknad: behandlingSelectors.getSoknad(state),
});

export default connect(mapStateToProps)(PapirsoknadInfoSetter);
