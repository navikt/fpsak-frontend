import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TilbakekrevingTimeline from './TilbakekrevingTimeline';

export class TilbakekrevingTimelinePanel extends Component {
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
      this.setState(state => ({ ...state, valgtPeriode: vPeriode }));
    }
  }

  selectHandler = (eventProps) => {
    const { perioder, setPeriode } = this.props;
    const valgtPeriode = perioder.find(periode => periode.id === eventProps.items[0]);
    if (valgtPeriode) {
      setPeriode(valgtPeriode);
      this.setState({ valgtPeriode });
    }
    eventProps.event.preventDefault();
  }

  nextPeriod = (event) => {
    const { perioder, setPeriode } = this.props;
    const { valgtPeriode } = this.state;
    const newIndex = perioder.findIndex(periode => periode.fom === valgtPeriode.fom && periode.tom === valgtPeriode.tom) + 1;
    if (newIndex < perioder.length) {
      setPeriode(perioder[newIndex]);
      this.setState({ valgtPeriode: perioder[newIndex] });
    }
    event.preventDefault();
  }

  prevPeriod = (event) => {
    const { perioder, setPeriode } = this.props;
    const { valgtPeriode } = this.state;
    const newIndex = resultatActivity.findIndex(periode => periode.fom === valgtPeriode.fom && periode.tom === valgtPeriode.tom) - 1;
    if (newIndex >= 0) {
      setPeriode(perioder[newIndex]);
      this.setState({ valgtPeriode: perioder[newIndex] });
    }
    event.preventDefault();
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
        HjelpetekstKomponent={hjelpetekstKomponent}
        kjonn={kjonn}
      />
    );
  }
}

TilbakekrevingTimelinePanel.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.shape({
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
  hjelpetekstKomponent: PropTypes.func.isRequired,
};

TilbakekrevingTimelinePanel.defaultProps = {
  valgtPeriode: undefined,
};

export default TilbakekrevingTimelinePanel;
