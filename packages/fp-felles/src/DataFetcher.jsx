import { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export const format = (name) => name.toLowerCase().replace(/_([a-z])/g, (m) => m.toUpperCase()).replace(/_/g, '');

const FETCH_PREFIX = 'FETCH_';

/**
 * DataFetcher
 *
 * Henter data fra valgte restendepunkter. Ved endring i behandlingId eller behandlingVersjon blir data hentet på nytt
 */
export class DataFetcher extends Component {
  static propTypes = {
    behandlingId: PropTypes.number,
    behandlingVersjon: PropTypes.number,
    showComponent: PropTypes.bool,
    showComponentDuringFetch: PropTypes.bool,
    isFetchFinished: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    render: PropTypes.func.isRequired,
  };

  static defaultProps = {
    behandlingId: undefined,
    behandlingVersjon: undefined,
    showComponent: true,
    showComponentDuringFetch: false,
  }

  fetchData = () => {
    const { data } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    data.forEach((d) => this.props[`${FETCH_PREFIX}${d.name}`]());
  }

  componentDidMount = () => {
    const { showComponent, behandlingId, behandlingVersjon } = this.props;
    if (showComponent && behandlingId && behandlingVersjon) {
      this.fetchData();
    }
  }

  componentDidUpdate = (prevProps) => {
    const {
      showComponent, behandlingId, behandlingVersjon,
    } = this.props;
    if (showComponent && behandlingId && behandlingVersjon
      && (behandlingId !== prevProps.behandlingId || behandlingVersjon !== prevProps.behandlingVersjon)) {
      this.fetchData();
    }
  }

  render() {
    const {
      showComponent, showComponentDuringFetch, isFetchFinished, render, data, behandlingId, behandlingVersjon,
    } = this.props;

    if (showComponentDuringFetch || (showComponent && behandlingId && behandlingVersjon && isFetchFinished)) {
      const dataProps = data.reduce((acc, d) => {
        const propName = format(d.name);
        return {
          ...acc,
          // eslint-disable-next-line react/destructuring-assignment
          [propName]: this.props[propName],
        };
      }, {});
      return render(dataProps);
    }

    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const data = ownProps.data.reduce((acc, dataApi) => ({
    ...acc,
    [format(dataApi.name)]: dataApi.getRestApiData()(state),
  }), {});

  return {
    ...data,
    isFetchFinished: ownProps.data.every((dataApi) => dataApi.getRestApiFinished()(state)),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(
  ownProps.data.reduce((acc, dataApi) => ({
    ...acc,
    [`${FETCH_PREFIX}${dataApi.name}`]: dataApi.makeRestApiRequest(),
  }), {}), dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(DataFetcher);
