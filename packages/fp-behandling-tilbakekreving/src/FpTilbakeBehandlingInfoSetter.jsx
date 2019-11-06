import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/tilbakekrevingBehandlingSelectors';

// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpTilbakeBehandlingInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingVersjon, aksjonspunkter,
      behandlingsresultat, soknad,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingVersjon(behandlingVersjon)
      .withAksjonspunkter(aksjonspunkter)
      .withBehandlingsresultat(behandlingsresultat)
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

FpTilbakeBehandlingInfoSetter.propTypes = {
  setBehandlingInfoHolder: PropTypes.func.isRequired,
  behandlingVersjon: PropTypes.number,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired),
  behandlingsresultat: PropTypes.shape(),
  soknad: PropTypes.shape(),
};

FpTilbakeBehandlingInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
  aksjonspunkter: [],
  behandlingsresultat: undefined,
  soknad: undefined,
};

const mapStateToProps = (state) => ({
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  soknad: behandlingSelectors.getSoknad(state),
});

export default connect(mapStateToProps)(FpTilbakeBehandlingInfoSetter);
