import { createSelector } from 'reselect';
import fpsakApi from 'data/fpsakApi';

/* Selectors */
export const getKodeverk = kodeverkType => createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getAlleKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk,
);

export const getKodeverkReceived = fpsakApi.KODEVERK.getRestApiFinished();
