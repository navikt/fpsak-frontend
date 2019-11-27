import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import fpsakBehandlingApi from '../data/fpsakBehandlingApi';

const reducerName = 'forstegangOgRevurderingBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  return dispatch(fpsakBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true }));
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};
export const tempUpdateStonadskontoer = (params) => (dispatch) => dispatch(fpsakBehandlingApi.STONADSKONTOER_GITT_UTTAKSPERIODER.makeRestApiRequest()(params))
  .then((response) => response.payload);

export const fetchPreviewBrev = fpsakBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
export const fetchFptilbakePreviewBrev = fpsakBehandlingApi.PREVIEW_TILBAKEKREVING_MESSAGE.makeRestApiRequest();

export const { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter, getResolveProsessAksjonspunkterSuccess } = behandlingsprosessRedux.selectors;
export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn, toggleBehandlingspunktOverstyring } = behandlingsprosessRedux.actionCreators;
