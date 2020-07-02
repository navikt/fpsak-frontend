import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fpsakApi from '../../data/fpsakApi';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import { getIntegrationStatusList, getShowDetailedErrorMessages } from '../duck';
import IntegrationStatusPanel from './IntegrationStatusPanel';

interface OwnProps {
  showIntegrationStatus?: boolean;
  integrationStatusList: {
    systemNavn?: string;
    endepunkt?: string;
    nedeFremTilTidspunkt?: string;
    feilmelding?: string;
    stackTrace?: string;
  }[];
  fetchIntegrationStatus: () => void;
}

/**
 * Dashboard
 *
 * Presentasjonskomponent. Viser statuspanelet for integrasjonsstjenester i tillegg til søkepanel.
 */
export class Dashboard extends Component<OwnProps> {
  static defaultProps = {
    showIntegrationStatus: false,
    integrationStatusList: [],
  };

  componentDidMount() {
    const { fetchIntegrationStatus, showIntegrationStatus } = this.props;

    if (showIntegrationStatus) {
      fetchIntegrationStatus();
    }
  }

  render() {
    const { integrationStatusList, showIntegrationStatus } = this.props;
    return (
      <>
        {showIntegrationStatus && integrationStatusList.length > 0
          && <IntegrationStatusPanel integrationStatusList={integrationStatusList} />}
        <FagsakSearchIndex />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  showIntegrationStatus: getShowDetailedErrorMessages(state),
  integrationStatusList: getIntegrationStatusList(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchIntegrationStatus: fpsakApi.INTEGRATION_STATUS.makeRestApiRequest(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
