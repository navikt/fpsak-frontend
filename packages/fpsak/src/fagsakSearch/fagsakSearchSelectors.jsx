import { createSelector } from 'reselect';

import { errorOfType, ErrorTypes, getErrorResponseData } from 'app/ErrorTypes';
import fpsakApi from 'data/fpsakApi';

export const getFagsaker = fpsakApi.SEARCH_FAGSAK.getRestApiData();
export const getSearchFagsakerStarted = fpsakApi.SEARCH_FAGSAK.getRestApiStarted();
export const getSearchFagsakerFinished = fpsakApi.SEARCH_FAGSAK.getRestApiFinished();

export const getSearchFagsakerAccessDenied = createSelector(
  [fpsakApi.SEARCH_FAGSAK.getRestApiError()],
  (error) => {
    if (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)) {
      return getErrorResponseData(error);
    }
    return undefined;
  },
);
