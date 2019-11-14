import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { BehandlingInfoHolder } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from './selectors/innsynBehandlingSelectors';

// TODO (TOR) Midlertidig komponent. Ikkje legg meir her!! Komponentane utanfor behandlingskonteksten skal sjølv ha ansvar for å henta data
export class FpInnsynBehandlingInfoSetter extends Component {
  constructor(props) {
    super(props);
    this.setBehandlingInfo();
  }

  setBehandlingInfo = () => {
    const {
      setBehandlingInfoHolder, behandlingVersjon,
    } = this.props;

    setBehandlingInfoHolder(new BehandlingInfoHolder()
      .withBehandlingVersjon(behandlingVersjon));
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
  behandlingVersjon: PropTypes.number,
};

FpInnsynBehandlingInfoSetter.defaultProps = {
  behandlingVersjon: undefined,
};

const mapStateToProps = (state) => ({
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
});

export default connect(mapStateToProps)(FpInnsynBehandlingInfoSetter);
