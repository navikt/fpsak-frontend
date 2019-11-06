import { createSelector } from 'reselect';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import fpsakApi from '../data/fpsakApi';
import { getRettigheter, getBehandlingStatus, erBehandlingPaVent } from '../behandling/duck';
import { getSelectedSaksnummer } from '../fagsak/duck';
import SupportPanel from './supportPanels';


const getSendMessageIsRelevant = createSelector([getSelectedSaksnummer, erBehandlingPaVent],
  (fagsakSaksnummer, isOnHold) => (fagsakSaksnummer && !isOnHold));

const getReturnedIsRelevant = createSelector(
  [erBehandlingPaVent, fpsakApi.TOTRINNSAKSJONSPUNKT_ARSAKER_READONLY.getRestApiData(), getBehandlingStatus],
  (isOnHold, toTrinnsAksjonspunkter = [], status = {}) => !isOnHold && toTrinnsAksjonspunkter.reduce((a, b) => a.concat(b.totrinnskontrollAksjonspunkter), [])
    .some((ap) => ap.totrinnskontrollGodkjent === false) && status.kode === behandlingStatus.BEHANDLING_UTREDES,
);

const getApprovalIsRelevant = createSelector([erBehandlingPaVent, getBehandlingStatus], (isOnHold, status = {}) => !isOnHold
  && status.kode === behandlingStatus.FATTER_VEDTAK);

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

export const getAllDocuments = createSelector([fpsakApi.ALL_DOCUMENTS.getRestApiData()],
  (documents = []) => documents);
