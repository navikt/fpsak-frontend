import React, { FunctionComponent, ReactElement } from 'react';

import { featureToggle } from '@fpsak-frontend/konstanter';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@fpsak-frontend/rest-api-hooks';

import { FpsakApiKeys, useGlobalStateRestApi } from '../data/fpsakApiNyUtenRedux';

interface OwnProps {
  children: ReactElement,
}

const NO_PARAMS = {};

// Må sette fptilbake til disabled når feature toggle er av eller kall har feila

const AppConfigResolver: FunctionComponent<OwnProps> = ({
  children,
}) => {
  const { state: navAnsattState } = useGlobalStateRestApi(FpsakApiKeys.NAV_ANSATT);
  const { state: sprakFilState } = useGlobalStateRestApi(FpsakApiKeys.LANGUAGE_FILE);
  const { state: behandlendeEnheterState } = useGlobalStateRestApi(FpsakApiKeys.BEHANDLENDE_ENHETER);
  const { state: visDetaljerteFeilmeldingerState } = useGlobalStateRestApi(FpsakApiKeys.SHOW_DETAILED_ERROR_MESSAGES);
  const featureToggleParams = { toggles: Object.values(featureToggle).map((ft) => ({ navn: ft })) };
  const { data: featureToggles, state: featureToggleState } = useGlobalStateRestApi(FpsakApiKeys.FEATURE_TOGGLE, featureToggleParams);

  const { state: kodeverkFpSakStatus } = useGlobalStateRestApi(FpsakApiKeys.KODEVERK, NO_PARAMS, {
    suspendRequest: featureToggleState !== RestApiState.SUCCESS, updateTriggers: [!!featureToggles],
  });
  const skalHenteFpTilbakeKodeverk = featureToggles && featureToggles[featureToggle.AKTIVER_TILBAKEKREVINGBEHANDLING];
  const { state: kodeverkFpTilbakeStatus } = useGlobalStateRestApi(FpsakApiKeys.KODEVERK_FPTILBAKE, NO_PARAMS, {
    suspendRequest: !skalHenteFpTilbakeKodeverk, updateTriggers: [!!featureToggles],
  });

  const erFerdig = navAnsattState === RestApiState.SUCCESS && sprakFilState === RestApiState.SUCCESS
    && behandlendeEnheterState === RestApiState.SUCCESS && visDetaljerteFeilmeldingerState === RestApiState.SUCCESS
    && kodeverkFpSakStatus === RestApiState.SUCCESS && (kodeverkFpTilbakeStatus === RestApiState.SUCCESS || !skalHenteFpTilbakeKodeverk);

  return erFerdig ? children : <LoadingPanel />;
};

export default AppConfigResolver;
