import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
/* import { featureToggle } from '@fpsak-frontend/fp-felles'; */

export const reducerName = 'app';

/* Action creators */
export const fetchAllFeatureToggles = () => (dispatch) => (
  dispatch(fpsakApi.FEATURE_TOGGLE.makeRestApiRequest()())
);

/* Selectors */
export const getNavAnsattName = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.navn);
export const getFunksjonellTid = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.funksjonellTid);
export const getFeatureToggles = createSelector([fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles);
export const getShowDetailedErrorMessages = createSelector(
  [fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiData()], (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [fpsakApi.INTEGRATION_STATUS.getRestApiData()], (integrationStatusList = []) => integrationStatusList,
);
