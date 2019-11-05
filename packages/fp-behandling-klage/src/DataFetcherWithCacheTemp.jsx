import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { KlageBehandlingApiKeys } from './data/klageBehandlingApi';

// TODO (TOR) Denne klassen skal hente data fra server. Men funksjonalitet kan ikkje implementerast før
// alle panel nyttar denne. No hentar den ynskja data fra behandling-objektet og lagar props av det.
export class DataFetcherWithCache extends Component {
  static propTypes = {
    behandlingData: PropTypes.shape(),
    showComponent: PropTypes.bool,
    render: PropTypes.func.isRequired,
  };

  static defaultProps = {
    showComponent: true,
    behandlingData: undefined,
  }

  render() {
    const { showComponent, behandlingData, render } = this.props;
    return showComponent ? render(behandlingData) : null;
  }
}

const mapping = {
  [KlageBehandlingApiKeys.KLAGE_VURDERING]: 'klage-vurdering',
};

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const mapStateToPropsFactory = () => {
  const createProps = createSelector([(state, ownProps) => ownProps.data[0].getRestApiData()(state), (state, ownProps) => ownProps.data], (
    behandling, data,
  ) => ({
    behandlingData: data
      .reduce((acc, d) => ({
        ...acc,
        [format(d.name)]: d.name === KlageBehandlingApiKeys.BEHANDLING ? behandling : behandling[mapping[d.name]],
      }), {}),
  }));
  return (state, ownProps) => (ownProps.showComponent !== false ? createProps(state, ownProps) : {});
};

export default connect(mapStateToPropsFactory)(DataFetcherWithCache);
