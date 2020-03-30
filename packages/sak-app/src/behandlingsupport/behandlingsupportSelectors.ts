import { createSelector } from 'reselect';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { supportTabs } from '@fpsak-frontend/sak-support-meny';

import { getNavAnsatt } from '../app/duck';
import fpsakApi from '../data/fpsakApi';
import {
  getBehandlingStatus, getBehandlingType, erBehandlingPaVent, getBehandlingAnsvarligSaksbehandler,
} from '../behandling/duck';
import { getSelectedSaksnummer } from '../fagsak/duck';
import { getSelectedFagsakStatus } from '../fagsak/fagsakSelectors';
import allSupportPanelAccessRights from './accessSupport';

type TotrinnskontrollAksjonspunkt = {
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: {
    aksjonspunktKode: string;
  };
}

const getRettigheter = createSelector([
  getNavAnsatt,
  getSelectedFagsakStatus,
  getBehandlingStatus,
  getBehandlingType,
  getBehandlingAnsvarligSaksbehandler,
], allSupportPanelAccessRights);

const getSendMessageIsRelevant = createSelector([getSelectedSaksnummer, erBehandlingPaVent],
  (fagsakSaksnummer, isOnHold) => (fagsakSaksnummer && !isOnHold));

const getReturnedIsRelevant = createSelector(
  [erBehandlingPaVent, fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData(), getBehandlingStatus],
  (isOnHold, toTrinnsAksjonspunkter: TotrinnskontrollAksjonspunkt[] = [], status) => !isOnHold && toTrinnsAksjonspunkter
    .reduce((a, b) => a.concat(b.totrinnskontrollAksjonspunkter), [])
    .some((ap) => ap.totrinnskontrollGodkjent === false) && status && status.kode === behandlingStatus.BEHANDLING_UTREDES,
);

const getApprovalIsRelevant = createSelector([erBehandlingPaVent, getBehandlingStatus], (isOnHold, status) => !isOnHold
  && status && status.kode === behandlingStatus.FATTER_VEDTAK);

export const getAccessibleSupportPanels = createSelector(
  [
    getReturnedIsRelevant,
    getApprovalIsRelevant,
    getRettigheter,
  ],
  (returnIsRelevant, approvalIsRelevant, rettigheter) => Object.values(supportTabs)
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
    }),
);

export const getEnabledSupportPanels = createSelector(
  [
    getAccessibleSupportPanels,
    getSendMessageIsRelevant,
    getRettigheter,
  ],
  (accessibleSupportPanels, sendMessageIsRelevant, rettigheter) => accessibleSupportPanels
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
    }),
);
