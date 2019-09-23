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
      behandlingAnsvarligSaksbehandler, behandlingsresultat,
      behandlingIsOnHold, behandlingIsQueued, soknad,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingSprak(behandlingSprak)
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingAnsvarligSaksbehandler(behandlingAnsvarligSaksbehandler)
      .withBehandlingsresultat(behandlingsresultat)
      .withBehandlingIsOnHold(behandlingIsOnHold)
      .withBehandlingIsQueued(behandlingIsQueued)
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
  behandlingsresultat: PropTypes.shape(),
  behandlingIsOnHold: PropTypes.bool.isRequired,
  behandlingIsQueued: PropTypes.bool,
  soknad: PropTypes.shape(),
};

PapirsoknadInfoSetter.defaultProps = {
  behandlingSprak: undefined,
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingAnsvarligSaksbehandler: undefined,
  behandlingsresultat: undefined,
  behandlingIsQueued: false,
  soknad: undefined,
};

const mapStateToProps = (state) => ({
  behandlingSprak: behandlingSelectors.getBehandlingSprak(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingAnsvarligSaksbehandler: behandlingSelectors.getBehandlingAnsvarligSaksbehandler(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingIsOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  behandlingIsQueued: behandlingSelectors.getBehandlingIsQueued(state),
  soknad: behandlingSelectors.getSoknad(state),
});

export default connect(mapStateToProps)(PapirsoknadInfoSetter);
