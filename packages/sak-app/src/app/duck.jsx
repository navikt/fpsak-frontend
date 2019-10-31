import { createSelector } from 'reselect';
import { featureToggle } from '@fpsak-frontend/fp-felles';

import fpsakApi from '../data/fpsakApi';

export const reducerName = 'app';

/* Action creators */
export const fetchAllFeatureToggles = () => (dispatch) => (
  dispatch(fpsakApi.FEATURE_TOGGLE.makeRestApiRequest()({ toggles: Object.values(featureToggle).map((ft) => ({ navn: ft })) }))
);

/* Selectors */
export const getNavAnsatt = createSelector([fpsakApi.NAV_ANSATT.getRestApiData()], (navAnsattData) => navAnsattData || {});
export const getNavAnsattName = createSelector([getNavAnsatt], (navAnsatt) => navAnsatt.navn);
export const getFunksjonellTid = createSelector([getNavAnsatt], (navAnsatt) => navAnsatt.funksjonellTid);
export const getFeatureToggles = createSelector([fpsakApi.FEATURE_TOGGLE.getRestApiData()], (ftData = {}) => ftData.featureToggles);
export const getShowDetailedErrorMessages = createSelector(
  [fpsakApi.SHOW_DETAILED_ERROR_MESSAGES.getRestApiData()], (showDetailedErrorMessages = false) => showDetailedErrorMessages,
);
export const getIntegrationStatusList = createSelector(
  [fpsakApi.INTEGRATION_STATUS.getRestApiData()], (integrationStatusList = []) => integrationStatusList,
);
