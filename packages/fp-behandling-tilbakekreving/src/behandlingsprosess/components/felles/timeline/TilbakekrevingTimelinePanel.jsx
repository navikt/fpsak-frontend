import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TilbakekrevingTimeline from './TilbakekrevingTimeline';

// TODO (TOR) Slå saman med TilbakekrevingTimeline.jsx

class TilbakekrevingTimelinePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valgtPeriode: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      valgtPeriode: vPeriode,
    } = nextProps;
    const {
      valgtPeriode,
    } = this.state;

    if (vPeriode !== valgtPeriode) {
      this.setState((state) => ({ ...state, valgtPeriode: vPeriode }));
    }
  }

  selectHandler = (eventProps) => {
    const { perioder, setPeriode } = this.props;
    const valgtPeriode = perioder.find((periode) => periode.id === eventProps.items[0]);
    if (valgtPeriode) {
      setPeriode(valgtPeriode);
      this.setState({ valgtPeriode });
    }
    eventProps.event.preventDefault();
  }

  render() {
    const {
      perioder,
      toggleDetaljevindu,
      hjelpetekstKomponent,
      kjonn,
    } = this.props;
    const {
      valgtPeriode,
    } = this.state;

    return (
      <TilbakekrevingTimeline
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        selectPeriodCallback={this.selectHandler}
        toggleDetaljevindu={toggleDetaljevindu}
        hjelpetekstKomponent={hjelpetekstKomponent}
        kjonn={kjonn}
      />
    );
  }
}

TilbakekrevingTimelinePanel.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    isAksjonspunktOpen: PropTypes.bool.isRequired,
    isGodkjent: PropTypes.bool.isRequired,
  })).isRequired,
  valgtPeriode: PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    isAksjonspunktOpen: PropTypes.bool.isRequired,
    isGodkjent: PropTypes.bool.isRequired,
  }),
  setPeriode: PropTypes.func.isRequired,
  toggleDetaljevindu: PropTypes.func.isRequired,
  kjonn: PropTypes.string.isRequired,
  hjelpetekstKomponent: PropTypes.node.isRequired,
};

TilbakekrevingTimelinePanel.defaultProps = {
  valgtPeriode: undefined,
};

export default TilbakekrevingTimelinePanel;
