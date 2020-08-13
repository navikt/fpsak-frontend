import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SupportMenySakIndex, { supportTabs } from '@fpsak-frontend/sak-support-meny';
import { NavAnsatt, Fagsak } from '@fpsak-frontend/types';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingAppKontekst from '../behandling/behandlingAppKontekstTsType';
import {
  getSelectedBehandlingId, getBehandlingVersjon,
} from '../behandling/duck';
import { getSupportPanelLocationCreator } from '../app/paths';
import HistoryIndex from './history/HistoryIndex';
import MessagesIndex from './messages/MessagesIndex';
import DocumentIndex from './documents/DocumentIndex';
import ApprovalIndex from './approval/ApprovalIndex';
import useTrackRouteParam from '../app/useTrackRouteParam';
import allSupportPanelAccessRights from './accessSupport';
import styles from './behandlingSupportIndex.less';
import { FpsakApiKeys, useRestApi, useGlobalStateRestApiData } from '../data/fpsakApi';

const renderSupportPanel = (
  supportPanel, totrinnArsaker, totrinnArsakerReadOnly, fagsak, alleBehandlinger, behandlingId, behandlingVersjon,
) => {
  switch (supportPanel) {
    case supportTabs.APPROVAL:
    case supportTabs.RETURNED:
      return (
        <ApprovalIndex
          fagsak={fagsak}
          alleBehandlinger={alleBehandlinger}
          totrinnskontrollSkjermlenkeContext={totrinnArsaker}
          totrinnskontrollReadOnlySkjermlenkeContext={totrinnArsakerReadOnly}
        />
      );
    case supportTabs.HISTORY:
      return (
        <HistoryIndex
          saksnummer={fagsak.saksnummer}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      );
    case supportTabs.MESSAGES:
      return (
        <MessagesIndex fagsak={fagsak} alleBehandlinger={alleBehandlinger} />);
    case supportTabs.DOCUMENTS:
      return (<DocumentIndex saksnummer={fagsak.saksnummer} />);
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
  fagsak: Fagsak;
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId?: number;
  behandlingVersjon?: number;
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
  fagsak,
  alleBehandlinger,
  behandlingId,
  behandlingVersjon,
}) => {
  const { selected: selectedSupportPanel, location } = useTrackRouteParam<string>({
    paramName: 'stotte',
    isQueryParam: true,
  });

  const behandling = alleBehandlinger.find((b) => b.id === behandlingId);
  const erPaVent = behandling ? behandling.behandlingPaaVent : false;

  const isInnsynBehandling = behandling && behandling.type.kode === BehandlingType.DOKUMENTINNSYN;

  const history = useHistory();
  const getSupportPanelLocation = getSupportPanelLocationCreator(location);

  const behandlingStatusKode = behandling ? behandling.status.kode : undefined;
  const { data: totrinnArsaker } = useRestApi<TotrinnskontrollAksjonspunkt[]>(FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER, NO_PARAMS, {
    updateTriggers: [behandlingId, behandlingStatusKode],
    suspendRequest: isInnsynBehandling || behandlingStatusKode !== BehandlingStatus.FATTER_VEDTAK,
  });
  const { data: totrinnArsakerReadOnly } = useRestApi<TotrinnskontrollAksjonspunkt[]>(FpsakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY, NO_PARAMS, {
    updateTriggers: [behandlingId, behandlingStatusKode],
    suspendRequest: isInnsynBehandling || behandlingStatusKode !== BehandlingStatus.BEHANDLING_UTREDES,
  });

  const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(FpsakApiKeys.NAV_ANSATT);
  const rettigheter = useMemo(() => allSupportPanelAccessRights(navAnsatt, fagsak.status, behandling?.status,
    behandling?.type, behandling?.ansvarligSaksbehandler), []);
  const returnedIsRelevant = useMemo(() => getReturnedIsRelevant(erPaVent, totrinnArsakerReadOnly, behandling?.status), []);
  const approvalIsRelevant = useMemo(() => !erPaVent && behandlingStatusKode === BehandlingStatus.FATTER_VEDTAK, []);
  const acccessibleSupportPanels = useMemo(() => getAccessibleSupportPanels(returnedIsRelevant, approvalIsRelevant, rettigheter), []);
  const sendMessageIsRelevant = useMemo(() => (fagsak && !erPaVent), []);
  const enabledSupportPanels = useMemo(() => getEnabledSupportPanels(acccessibleSupportPanels, sendMessageIsRelevant, rettigheter), []);
  const defaultSupportPanel = enabledSupportPanels.find(() => true) || supportTabs.HISTORY;
  const activeSupportPanel = enabledSupportPanels.includes(selectedSupportPanel) ? selectedSupportPanel : defaultSupportPanel;

  const changeRouteCallback = useCallback((index) => {
    const supportPanel = acccessibleSupportPanels[index];
    history.push(getSupportPanelLocation(supportPanel));
  }, [location, acccessibleSupportPanels]);

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
        {renderSupportPanel(
          activeSupportPanel,
          totrinnArsaker,
          totrinnArsakerReadOnly,
          fagsak,
          alleBehandlinger,
          behandlingId,
          behandlingVersjon,
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  behandlingId: getSelectedBehandlingId(state),
  behandlingVersjon: getBehandlingVersjon(state),
});

export default connect(mapStateToProps)(BehandlingSupportIndex);
