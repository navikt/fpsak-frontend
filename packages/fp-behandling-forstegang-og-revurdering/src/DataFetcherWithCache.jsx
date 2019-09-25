import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { BehandlingFpsakApiKeys } from './data/fpsakBehandlingApi';

// TODO (TOR) Denne klassen skal hente data fra server. Men funksjonalitet kan ikkje implementerast før
// alle panel nyttar denne. No hentar den ynskja data fra behandling-objektet og lagar props av det.
export class DataFetcherWithCache extends Component {
  static propTypes = {
    behandlingData: PropTypes.shape().isRequired,
    render: PropTypes.func.isRequired,
  };

  render() {
    const { behandlingData, render } = this.props;
    return render(behandlingData);
  }
}

const mapping = {
  [BehandlingFpsakApiKeys.PERSONOPPLYSNINGER]: 'soeker-personopplysninger',
  [BehandlingFpsakApiKeys.SIMULERING_RESULTAT]: 'simuleringResultat',
  [BehandlingFpsakApiKeys.TILBAKEKREVINGVALG]: 'tilbakekrevingvalg',
  [BehandlingFpsakApiKeys.AKSJONSPUNKTER]: 'aksjonspunkter',
  [BehandlingFpsakApiKeys.BEREGNINGRESULTAT_ENGANGSSTONAD]: 'beregningsresultat-engangsstonad',
  [BehandlingFpsakApiKeys.FAMILIEHENDELSE]: 'familiehendelse-v2',
  [BehandlingFpsakApiKeys.SOKNAD]: 'soknad',
  [BehandlingFpsakApiKeys.ORIGINAL_BEHANDLING]: 'original-behandling',
};

const format = (name) => name.toLowerCase().replace(/_([a-z])/, (m) => m.toUpperCase()).replace(/_/, '');

const createProps = createSelector([(state, ownProps) => ownProps.data[0].getRestApiData()(state), (state, ownProps) => ownProps.data], (
  behandling, data,
) => ({
  behandlingData: data
    .reduce((acc, d) => ({
      ...acc,
      [format(d.name)]: d.name === BehandlingFpsakApiKeys.BEHANDLING ? behandling : behandling[mapping[d.name]],
    }), {}),
}));

const mapStateToProps = (state, ownProps) => createProps(state, ownProps);

export default connect(mapStateToProps)(DataFetcherWithCache);
