import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getIntegrationStatusList, getShowDetailedErrorMessages } from 'app/duck';
import fpsakApi from 'data/fpsakApi';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import FagsakSearchIndex from 'fagsakSearch/FagsakSearchIndex';
import IntegrationStatusPanel from './IntegrationStatusPanel';

/**
 * Dashboard
 *
 * Presentasjonskomponent. Viser statuspanelet for integrasjonsstjenester i tillegg til søkepanel.
 */
export class Dashboard extends Component {
  componentDidMount() {
    const { fetchIntegrationStatus, showIntegrationStatus } = this.props;

    if (showIntegrationStatus) {
      fetchIntegrationStatus();
    }
  }

  render() {
    const { integrationStatusList, showIntegrationStatus } = this.props;
    return (
      <ElementWrapper>
        {showIntegrationStatus && integrationStatusList.length > 0
          && <IntegrationStatusPanel integrationStatusList={integrationStatusList} />
        }
        <FagsakSearchIndex />
      </ElementWrapper>
    );
  }
}

Dashboard.propTypes = {
  showIntegrationStatus: PropTypes.bool,
  integrationStatusList: PropTypes.arrayOf(PropTypes.shape({
    systemNavn: PropTypes.string,
    endepunkt: PropTypes.string,
    nedeFremTilTidspunkt: PropTypes.string,
    feilmelding: PropTypes.string,
    stackTrace: PropTypes.string,
  })),
  fetchIntegrationStatus: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  showIntegrationStatus: false,
  integrationStatusList: [],
};

const mapStateToProps = state => ({
  showIntegrationStatus: getShowDetailedErrorMessages(state),
  integrationStatusList: getIntegrationStatusList(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchIntegrationStatus: fpsakApi.INTEGRATION_STATUS.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
