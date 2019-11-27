import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import ankeBehandlingApi from '../data/ankeBehandlingApi';

const reducerName = 'ankeBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  return dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true }));
};

export const resolveAnkeTemp = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(ankeBehandlingApi.SAVE_REOPEN_ANKE_VURDERING.makeRestApiRequest()(params))
    .then((response) => dispatch(ankeBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })))
    .then(ankeBehandlingApi.SAVE_ANKE_VURDERING.resetRestApi());
};

export const saveAnke = (params) => (dispatch) => (
  dispatch(ankeBehandlingApi.SAVE_ANKE_VURDERING.makeRestApiRequest()(params))
);

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(ankeBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const fetchPreviewAnkeBrev = ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn, toggleBehandlingspunktOverstyring } = behandlingsprosessRedux.actionCreators;
export const { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter, getResolveProsessAksjonspunkterSuccess } = behandlingsprosessRedux.selectors;
