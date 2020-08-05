import { createSelector } from 'reselect';

import fpsakApi from '../data/fpsakApi';

export const getAktoerContext = (state) => state.default.aktoer;
export const getSelectedAktoerId = (state) => getAktoerContext(state).selectedAktoerId;

const AktoerInfoDataResult = fpsakApi.AKTOER_INFO.getRestApiData();

export const getSelectedAktoer = createSelector(
  [getSelectedAktoerId, AktoerInfoDataResult],
  (selectedAktoerId, aktoerInfo = {}) => (aktoerInfo || undefined),
);

export const getAllAktoerInfoResolved = createSelector(
  [AktoerInfoDataResult], (...data) => !data.some((d) => d === undefined),
);
