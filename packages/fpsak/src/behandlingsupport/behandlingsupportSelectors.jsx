import { createSelector } from 'reselect';
import moment from 'moment';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import fpsakApi from 'data/fpsakApi';
import {
  getBehandlingStatus,
  getBehandlingIsOnHold,
  getRettigheter,
} from 'behandling/duck';
import { getSelectedSaksnummer } from 'fagsak/duck';
import SupportPanel from './supportPanels';


const getSendMessageIsRelevant = createSelector([getSelectedSaksnummer, getBehandlingIsOnHold],
  (fagsakSaksnummer, isOnHold) => (fagsakSaksnummer && !isOnHold));

const getReturnedIsRelevant = createSelector(
  [fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData(), getBehandlingStatus],
  (toTrinnsAksjonspunkter = [], status = {}) => toTrinnsAksjonspunkter.reduce((a, b) => a.concat(b.totrinnskontrollAksjonspunkter), [])
    .some((ap) => ap.totrinnskontrollGodkjent === false) && status.kode === behandlingStatus.BEHANDLING_UTREDES,
);

const getApprovalIsRelevant = createSelector([getBehandlingStatus], (status = {}) => status.kode === behandlingStatus.FATTER_VEDTAK);

export const getAccessibleSupportPanels = createSelector(
  [
    getReturnedIsRelevant,
    getApprovalIsRelevant,
    getRettigheter,
  ],
  (returnIsRelevant, approvalIsRelevant, rettigheter) => Object.values(SupportPanel)
    .filter((supportPanel) => {
      switch (supportPanel) {
        case SupportPanel.MESSAGES:
          return rettigheter.sendMeldingAccess.employeeHasAccess;
        case SupportPanel.APPROVAL:
          return approvalIsRelevant && rettigheter.godkjenningsFaneAccess.employeeHasAccess;
        case SupportPanel.RETURNED:
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
        case SupportPanel.MESSAGES:
          return sendMessageIsRelevant && rettigheter.sendMeldingAccess.isEnabled;
        case SupportPanel.APPROVAL:
          return rettigheter.godkjenningsFaneAccess.isEnabled;
        case SupportPanel.RETURNED:
          return rettigheter.fraBeslutterFaneAccess.isEnabled;
        default:
          return true;
      }
    }),
);

export const getAllHistory = createSelector(
  [fpsakApi.HISTORY_FPSAK.getRestApiData(), fpsakApi.HISTORY_FPTILBAKE.getRestApiData()],
  (historyFpsak = [], historyTilbake = []) => (
    historyFpsak.concat(historyTilbake).sort((a, b) => moment(b.opprettetTidspunkt) - moment(a.opprettetTidspunkt))
  ),
);

export const getAllDocuments = createSelector([fpsakApi.ALL_DOCUMENTS.getRestApiData()],
  (documents = []) => documents);
