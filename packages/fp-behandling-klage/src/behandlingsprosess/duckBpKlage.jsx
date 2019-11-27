import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import klageBehandlingApi from '../data/klageBehandlingApi';

const reducerName = 'klageBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

export const resolveKlageTemp = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(klageBehandlingApi.SAVE_REOPEN_KLAGE_VURDERING.makeRestApiRequest()(params))
    .then((response) => dispatch(klageBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })))
    .then(klageBehandlingApi.SAVE_KLAGE_VURDERING.resetRestApi());
};

export const saveKlage = (params) => (dispatch) => (
  dispatch(klageBehandlingApi.SAVE_KLAGE_VURDERING.makeRestApiRequest()(params))
);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  return dispatch(klageBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true }));
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(klageBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(klageBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const fetchPreviewKlageBrev = klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn } = behandlingsprosessRedux.actionCreators;
export const { getSelectedBehandlingspunktNavn, getResolveProsessAksjonspunkterSuccess, getOverrideBehandlingspunkter } = behandlingsprosessRedux.selectors;
