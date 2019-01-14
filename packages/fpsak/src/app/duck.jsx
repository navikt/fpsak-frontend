import { createSelector } from 'reselect';

import fpsakApi from 'data/fpsakApi';
import featureToggle from './featureToggle';

export const reducerName = 'app';

/* Action creators */
export const fetchAllFeatureToggles = () => dispatch => (
  dispatch(fpsakApi.FEATURE_TOGGLE.makeRestApiRequest()({ toggles: Object.values(featureToggle).map(ft => ({ navn: ft })) }))
);

/* Selectors */
export const getNavAnsattName = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.navn);
export const getRettskildeUrl = createSelector([fpsakApi.RETTSKILDE_URL.getRestApiData()], (rettskildeData = {}) => rettskildeData.verdi);
export const getSystemrutineUrl = createSelector([fpsakApi.SYSTEMRUTINE_URL.getRestApiData()], (systemrutineData = {}) => systemrutineData.verdi);
export const getFunksjonellTid = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsatt = {}) => navAnsatt.funksjonellTid);
export const getFeatureToggles = createSelector([fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles);
export const getShowDetailedErrorMessages = createSelector(
  [fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiData()], (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [fpsakApi.INTEGRATION_STATUS.getRestApiData()], (integrationStatusList = []) => integrationStatusList,
);
