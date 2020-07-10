import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Location } from 'history';

import SupportMenySakIndex, { supportTabs } from '@fpsak-frontend/sak-support-meny';
import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import { NavAnsatt, Kodeverk } from '@fpsak-frontend/types';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import {
  getBehandlingStatus, getBehandlingType, erBehandlingPaVent, getBehandlingAnsvarligSaksbehandler,
  getSelectedBehandlingId,
} from '../behandling/duck';
import { getSelectedFagsakStatus } from '../fagsak/fagsakSelectors';
import { getSupportPanelLocationCreator } from '../app/paths';
import { getSelectedSaksnummer } from '../fagsak/duck';
import { getSelectedSupportPanel, setSelectedSupportPanel } from './duck';
import HistoryIndex from './history/HistoryIndex';
import MessagesIndex from './messages/MessagesIndex';
import DocumentIndex from './documents/DocumentIndex';
import ApprovalIndex from './approval/ApprovalIndex';
import trackRouteParam from '../app/trackRouteParam';
import allSupportPanelAccessRights from './accessSupport';
import styles from './behandlingSupportIndex.less';
import { FpsakApiKeys, useRestApi } from '../data/fpsakApiNyUtenRedux';

const renderSupportPanel = (supportPanel, totrinnArsaker, totrinnArsakerReadOnly) => {
  switch (supportPanel) {
    case supportTabs.APPROVAL:
    case supportTabs.RETURNED:
      return (<ApprovalIndex totrinnskontrollSkjermlenkeContext={totrinnArsaker} totrinnskontrollReadOnlySkjermlenkeContext={totrinnArsakerReadOnly} />);
    case supportTabs.HISTORY:
      return (<HistoryIndex />);
    case supportTabs.MESSAGES:
      return (<MessagesIndex />);
    case supportTabs.DOCUMENTS:
      return (<DocumentIndex />);
    default:
      return null;
  }
};

type TotrinnskontrollAksjonspunkt = {
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: {
    aksjonspunktKode: string;
  };
}

interface OwnProps {
  acccessibleSupportPanels: string[];
  activeSupportPanel: string;
  getSupportPanelLocation: (supportPanel: string) => Location;
  fagsakStatus: Kodeverk;
  behandlingStatus?: Kodeverk;
  behandlingType?: Kodeverk;
  behandlingAnsvarligSaksbehandler: string;
  erPaVent: boolean;
  selectedSaksnummer: string;
  selectedSupportPanel: string;
  behandlingId?: number;
  isInnsynBehandling: boolean;
}

const NO_PARAMS = {};

const getReturnedIsRelevant = (isOnHold, toTrinnsAksjonspunkter: TotrinnskontrollAksjonspunkt[] = [], status) => !isOnHold && toTrinnsAksjonspunkter
  .reduce((a, b) => a.concat(b.totrinnskontrollAksjonspunkter), [])
  .some((ap) => ap.totrinnskontrollGodkjent === false) && status && status.kode === BehandlingStatus.BEHANDLING_UTREDES;

export const getAccessibleSupportPanels = (returnIsRelevant, approvalIsRelevant, rettigheter) => Object.values(supportTabs)
  .filter((supportPanel) => {
    switch (supportPanel) {
      case supportTabs.MESSAGES:
        return rettigheter.sendMeldingAccess.employeeHasAccess;
      case supportTabs.APPROVAL:
        return approvalIsRelevant && rettigheter.godkjenningsFaneAccess.employeeHasAccess;
      case supportTabs.RETURNED:
        return returnIsRelevant && rettigheter.fraBeslutterFaneAccess.employeeHasAccess;
      default:
        return true;
    }
  });

export const getEnabledSupportPanels = (accessibleSupportPanels, sendMessageIsRelevant, rettigheter) => accessibleSupportPanels
  .filter((supportPanel) => {
    switch (supportPanel) {
      case supportTabs.MESSAGES:
        return sendMessageIsRelevant && rettigheter.sendMeldingAccess.isEnabled;
      case supportTabs.APPROVAL:
        return rettigheter.godkjenningsFaneAccess.isEnabled;
      case supportTabs.RETURNED:
        return rettigheter.fraBeslutterFaneAccess.isEnabled;
      default:
        return true;
    }
  });

// fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData()

/**
 * BehandlingSupportIndex
 *
 * Containerkomponent for behandlingsstøttepanelet.
 * Har ansvar for å lage navigasjonsrad med korrekte navigasjonsvalg, og route til rett
 * støttepanelkomponent ihht. gitt parameter i URL-en.
 */
export const BehandlingSupportIndex: FunctionComponent<OwnProps> = ({
  getSupportPanelLocation,
  fagsakStatus,
  behandlingStatus,
  behandlingType,
  behandlingAnsvarligSaksbehandler,
  erPaVent,
  selectedSaksnummer,
  selectedSupportPanel,
  isInnsynBehandling,
  behandlingId,
}) => {
  const history = useHistory();

  const behandlingStatusKode = behandlingStatus ? behandlingStatus.kode : undefined;
  const { data: totrinnArsaker } = useRestApi<TotrinnskontrollAksjonspunkt[]>(FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER, NO_PARAMS, {
    updateTriggers: [behandlingId, behandlingStatusKode],
    suspendRequest: isInnsynBehandling || behandlingStatusKode !== BehandlingStatus.FATTER_VEDTAK,
  });
  const { data: totrinnArsakerReadOnly } = useRestApi<TotrinnskontrollAksjonspunkt[]>(FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY, NO_PARAMS, {
    updateTriggers: [behandlingId, behandlingStatusKode],
    suspendRequest: isInnsynBehandling || behandlingStatusKode !== BehandlingStatus.BEHANDLING_UTREDES,
  });

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => allSupportPanelAccessRights(navAnsatt, fagsakStatus, behandlingStatus, behandlingType, behandlingAnsvarligSaksbehandler),
    []);
  const returnedIsRelevant = useMemo(() => getReturnedIsRelevant(erPaVent, totrinnArsakerReadOnly, behandlingStatus), []);
  const approvalIsRelevant = useMemo(() => !erPaVent && behandlingStatusKode === BehandlingStatus.FATTER_VEDTAK, []);
  const acccessibleSupportPanels = useMemo(() => getAccessibleSupportPanels(returnedIsRelevant, approvalIsRelevant, rettigheter), []);
  const sendMessageIsRelevant = useMemo(() => (selectedSaksnummer && !erPaVent), []);
  const enabledSupportPanels = useMemo(() => getEnabledSupportPanels(acccessibleSupportPanels, sendMessageIsRelevant, rettigheter), []);
  const defaultSupportPanel = enabledSupportPanels.find(() => true) || supportTabs.HISTORY;
  const activeSupportPanel = enabledSupportPanels.includes(selectedSupportPanel) ? selectedSupportPanel : defaultSupportPanel;

  const changeRouteCallback = useCallback((index) => {
    const supportPanel = acccessibleSupportPanels[index];
    history.push(getSupportPanelLocation(supportPanel));
  }, [history.location, acccessibleSupportPanels]);

  return (
    <>
      <div className={styles.meny}>
        <SupportMenySakIndex
          tilgjengeligeTabs={acccessibleSupportPanels}
          valgbareTabs={enabledSupportPanels}
          valgtIndex={acccessibleSupportPanels.findIndex((p) => p === activeSupportPanel)}
          onClick={changeRouteCallback}
        />
      </div>
      <div className={(activeSupportPanel === supportTabs.HISTORY ? styles.containerHistorikk : styles.container)}>
        {renderSupportPanel(activeSupportPanel, totrinnArsaker, totrinnArsakerReadOnly)}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const behandlingType = getBehandlingType(state);
  return {
    behandlingType,
    behandlingId: getSelectedBehandlingId(state),
    selectedSupportPanel: getSelectedSupportPanel(state),
    fagsakStatus: getSelectedFagsakStatus(state),
    behandlingStatus: getBehandlingStatus(state),
    behandlingAnsvarligSaksbehandler: getBehandlingAnsvarligSaksbehandler(state),
    erPaVent: erBehandlingPaVent(state),
    selectedSaksnummer: getSelectedSaksnummer(state),
    isInnsynBehandling: !!behandlingType && behandlingType.kode === BehandlingType.DOKUMENTINNSYN,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...dispatchProps,
  ...stateProps,
  getSupportPanelLocation: getSupportPanelLocationCreator(ownProps.location), // gets prop 'location' from trackRouteParam
});

export default trackRouteParam({
  paramName: 'stotte',
  storeParam: setSelectedSupportPanel,
  getParamFromStore: getSelectedSupportPanel,
  isQueryParam: true,
})(connect(mapStateToProps, null, mergeProps)(BehandlingSupportIndex));
