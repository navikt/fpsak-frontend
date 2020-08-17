import { featureToggle } from '@fpsak-frontend/konstanter';

import { FpsakApiKeys, restApiHooks } from '../data/fpsakApi';
import ApplicationContextPath from './ApplicationContextPath';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.FPSAK];

  const featureToggles = restApiHooks.useGlobalStateRestApiData<{[key: string]: boolean}>(FpsakApiKeys.FEATURE_TOGGLE);
  const kodeverkFpTilbake = restApiHooks.useGlobalStateRestApiData(FpsakApiKeys.KODEVERK_FPTILBAKE);

  if (featureToggles[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING] && !!kodeverkFpTilbake) {
    enabledApplicationContexts.push(ApplicationContextPath.FPTILBAKE);
  }
  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;
