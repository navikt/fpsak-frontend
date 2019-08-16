import { getBehandlingsprosessRedux, sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import fpsakBehandlingApi from '../data/fpsakBehandlingApi';
import fptilbakeBehandlingApi from '../data/fptilbakeBehandlingApi';

const reducerName = 'forstegangOgRevurderingBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier, shouldUpdateInfo) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  if (shouldUpdateInfo) {
    return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
      .then(() => dispatch(fpsakBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
  }
  return true;
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};

export const overrideProsessAksjonspunkter = (behandlingIdentifier, params, shouldUpdateInfo) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then(response => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier, shouldUpdateInfo)));
};
export const tempUpdateStonadskontoer = params => dispatch => dispatch(fpsakBehandlingApi.STONADSKONTOER_GITT_UTTAKSPERIODER.makeRestApiRequest()(params))
  .then(response => response.payload);

export const fetchPreviewBrev = fpsakBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
export const fetchFptilbakePreviewBrev = fptilbakeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
export const fetchVedtaksbrevPreview = data => dispatch => dispatch(fpsakBehandlingApi.FORHANDSVISNING_FORVED_BREV.makeRestApiRequest()(data));

export const { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter, getResolveProsessAksjonspunkterSuccess } = behandlingsprosessRedux.selectors;
export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn, toggleBehandlingspunktOverstyring } = behandlingsprosessRedux.actionCreators;
