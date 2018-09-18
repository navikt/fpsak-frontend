import { createSelector } from 'reselect';
import { getRestApiData, getRestApiFinished } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

/* Selectors */
export const getKodeverk = kodeverkType => createSelector(
  [getRestApiData(FpsakApi.KODEVERK)],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getKodeverkReceived = getRestApiFinished(FpsakApi.KODEVERK);
