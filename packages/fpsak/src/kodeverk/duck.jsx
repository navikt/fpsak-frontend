import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';

export const fetchKodeverk = () => (dispatch) => behandlingOrchestrator.fetchKodeverk(dispatch);

/* Selectors */
export const getKodeverk = (kodeverkType) => createSelector(
  [fpsakApi.KODEVERK.getRestApiData()],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getFpTilbakeKodeverk = (kodeverkType) => createSelector(
  [fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverk = {}) => kodeverk[kodeverkType],
);

export const getAlleKodeverk = createSelector(
  [fpsakApi.KODEVERK.getRestApiData(), fpsakApi.KODEVERK_FPTILBAKE.getRestApiData()],
  (kodeverkFpsak = {}, kodeverkFptilbake = {}) => {
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
