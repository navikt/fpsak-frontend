import { getBehandlingsprosessRedux, sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi from '../data/ankeBehandlingApi';

const reducerName = 'ankeBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier, shouldUpdateInfo) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  if (shouldUpdateInfo) {
    return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
      .then(() => dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
  }
  return true;
};

export const resolveAnkeTemp = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(ankeBehandlingApi.SAVE_REOPEN_ANKE_VURDERING.makeRestApiRequest()(params))
    .then((response) => dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })))
    .then(ankeBehandlingApi.SAVE_ANKE_VURDERING.resetRestApi());
};

export const saveAnke = (params) => (dispatch) => (
  dispatch(ankeBehandlingApi.SAVE_ANKE_VURDERING.makeRestApiRequest()(params))
);

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(ankeBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const fetchPreviewBrev = ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
export const fetchPreviewAnkeBrev = ankeBehandlingApi.PREVIEW_MESSAGE_ANKE.makeRestApiRequest();

export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn, toggleBehandlingspunktOverstyring } = behandlingsprosessRedux.actionCreators;
export const { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter, getResolveProsessAksjonspunkterSuccess } = behandlingsprosessRedux.selectors;
