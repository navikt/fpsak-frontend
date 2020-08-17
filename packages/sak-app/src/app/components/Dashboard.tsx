import React, { FunctionComponent } from 'react';

import { FpsakApiKeys, restApiHooks } from '../../data/fpsakApi';
import FagsakSearchIndex from '../../fagsakSearch/FagsakSearchIndex';
import IntegrationStatusPanel from './IntegrationStatusPanel';

interface IntegrationStatus {
  systemNavn?: string;
  endepunkt?: string;
  nedeFremTilTidspunkt?: string;
  feilmelding?: string;
  stackTrace?: string;
}

const EMPTY_ARRAY = [];
const NO_PARAMS = {};

/**
 * Dashboard
 *
 * Presentasjonskomponent. Viser statuspanelet for integrasjonsstjenester i tillegg til søkepanel.
 */
const Dashboard: FunctionComponent = () => {
  const showIntegrationStatus = restApiHooks.useGlobalStateRestApiData<boolean>(FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES);

  const { data: integrationStatusList = EMPTY_ARRAY } = restApiHooks.useRestApi<IntegrationStatus[]>(FpsakApiKeys.INTEGRATION_STATUS, NO_PARAMS, {
    suspendRequest: !showIntegrationStatus,
    updateTriggers: [showIntegrationStatus],
  });

  return (
    <>
      {showIntegrationStatus && integrationStatusList.length > 0
        && <IntegrationStatusPanel integrationStatusList={integrationStatusList} />}
      <FagsakSearchIndex />
    </>
  );
};

export default Dashboard;
