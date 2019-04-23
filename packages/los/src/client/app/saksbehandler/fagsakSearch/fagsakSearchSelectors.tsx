
import { createSelector } from 'reselect';

import { errorOfType, ErrorTypes, getErrorResponseData } from 'app/ErrorTypes';
import fpLosApi from 'data/fpLosApi';

export const getFagsaker = fpLosApi.SEARCH_FAGSAK.getRestApiData();
export const getFagsakOppgaver = fpLosApi.OPPGAVER_FOR_FAGSAKER.getRestApiData();

export const getSearchFagsakerAccessDenied = createSelector(
  [fpLosApi.SEARCH_FAGSAK.getRestApiError()],
  (error) => {
    if (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)) {
      return getErrorResponseData(error);
    }
    return undefined;
  },
);
