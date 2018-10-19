import { createSelector } from 'reselect';

import { errorOfType, ErrorTypes, getErrorResponseData } from 'app/ErrorTypes';
import {
  getRestApiData, getRestApiError, getRestApiFinished, getRestApiStarted,
} from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

export const getFagsaker = getRestApiData(FpsakApi.SEARCH_FAGSAK);
export const getSearchFagsakerStarted = getRestApiStarted(FpsakApi.SEARCH_FAGSAK);
export const getSearchFagsakerFinished = getRestApiFinished(FpsakApi.SEARCH_FAGSAK);

export const getSearchFagsakerAccessDenied = createSelector(
  [getRestApiError(FpsakApi.SEARCH_FAGSAK)],
  (error) => {
    if (errorOfType(error, ErrorTypes.MANGLER_TILGANG_FEIL)) {
      return getErrorResponseData(error);
    }
    return undefined;
  },
);
