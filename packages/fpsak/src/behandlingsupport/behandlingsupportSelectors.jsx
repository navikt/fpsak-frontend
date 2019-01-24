import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import {
  getBehandlingHasSoknad,
  getBehandlingIsInnsyn,
  getBehandlingIsOnHold,
  getBehandlingStatus,
  getTotrinnskontrollArsakerReadOnly,
  isBehandlingInInnhentSoknadsopplysningerSteg,
  getBehandlingIsKlage,
} from 'behandlingFpsak/behandlingSelectors';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { getRettigheter } from 'navAnsatt/duck';
import SupportPanel from './supportPanels';

const getSendMessageIsRelevant = createSelector(
  [
    getBehandlingHasSoknad,
    isBehandlingInInnhentSoknadsopplysningerSteg,
    getBehandlingIsOnHold,
    getBehandlingIsInnsyn,
    getBehandlingIsKlage,
  ],
  (behandlingHasSoknad, behandlingIsInnhentSoknadsopplysninger, behandlingIsOnHold, behandlingIsInnsyn, behandlingIsKlage) => (
    (behandlingHasSoknad || behandlingIsInnhentSoknadsopplysninger || behandlingIsInnsyn || behandlingIsKlage) && !behandlingIsOnHold
  ),
);

const getReturnedIsRelevant = createSelector(
  [getTotrinnskontrollArsakerReadOnly, getBehandlingStatus],
  (toTrinnsAksjonspunkter = [], status = {}) => (
    toTrinnsAksjonspunkter.reduce((a, b) => a.concat(b.totrinnskontrollAksjonspunkter), [])
      .some(ap => ap.totrinnskontrollGodkjent === false) && status.kode === behandlingStatus.BEHANDLING_UTREDES
  ),
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

export const getAllHistory = createSelector([fpsakApi.HISTORY_FPSAK.getRestApiData(), fpsakApi.HISTORY_FPTILBAKE.getRestApiData()],
  (historyFpsak = [], historyTilbake = []) => (historyFpsak.concat(historyTilbake)));

export const getAllDocuments = createSelector([fpsakApi.ALL_DOCUMENTS_FPSAK.getRestApiData(), fpsakApi.ALL_DOCUMENTS_FPTILBAKE.getRestApiData()],
  (documentsFpsak = [], documentsTilbake = []) => (documentsFpsak.concat(documentsTilbake)));

// Samme dokument kan ligge på flere behandlinger under samme fagsak.
export const getFilteredReceivedDocuments = createSelector([getAllDocuments], (documents = []) => {
  const filteredDocuments = documents.filter(doc => doc.kommunikasjonsretning === kommunikasjonsretning.INN);
  documents.forEach(doc => !filteredDocuments.some(fd => fd.dokumentId === doc.dokumentId) && filteredDocuments.push(doc));
  return filteredDocuments;
});
