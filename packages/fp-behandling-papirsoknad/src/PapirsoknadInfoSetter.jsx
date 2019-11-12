import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
      setBehandlingInfoHolder, behandlingVersjon, behandlingsresultat,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingVersjon(behandlingVersjon)
      .withBehandlingsresultat(behandlingsresultat));
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
  behandlingVersjon: PropTypes.number,
  behandlingsresultat: PropTypes.shape(),
};

PapirsoknadInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
  behandlingsresultat: undefined,
};

const mapStateToProps = (state) => ({
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
});

export default connect(mapStateToProps)(PapirsoknadInfoSetter);
