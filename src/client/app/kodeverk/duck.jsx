import { createSelector } from 'reselect';
import { getRestApiData, getRestApiFinished } from '@fpsak-frontend/data/duck';
import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';

/* Selectors */
export const getKodeverk = kodeverkType => createSelector(
  [getRestApiData(FpsakApi.KODEVERK)],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getKodeverkReceived = getRestApiFinished(FpsakApi.KODEVERK);
