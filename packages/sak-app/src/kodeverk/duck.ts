import { createSelector } from 'reselect';

import { KodeverkMedNavn } from '@fpsak-frontend/types';

import fpsakApi from '../data/fpsakApi';

/* Selectors */
export const getKodeverk = (kodeverkType) => createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk: {[key: string]: KodeverkMedNavn[]} = {}) => kodeverk[kodeverkType],
);

export const getFpTilbakeKodeverk = (kodeverkType) => createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverk: {[key: string]: KodeverkMedNavn[]} = {}) => kodeverk[kodeverkType],
);

export const getAlleFpSakKodeverk = createSelector([fpsakApi.KODEVERK.getRestApiData()], (kodeverk = {}) => kodeverk);
export const getAlleFpTilbakeKodeverk = createSelector([fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()], (kodeverk = {}) => kodeverk);

// TODO (TOR) Fjern denne
export const getAlleKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData(), fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverkFpsak: {[key: string]: KodeverkMedNavn[]} = {}, kodeverkFptilbake: {[key: string]: KodeverkMedNavn[]} = {}) => {
    const result = {
      ...kodeverkFpsak,
    };
    Object.keys(kodeverkFptilbake).forEach((key) => {
      if (result[key]) {
        result[key] = result[key].concat(kodeverkFptilbake[key]);
      } else {
        result[key] = kodeverkFptilbake[key];
      }
    });
    return result;
  },
);
