import { getFaktaRedux, sakOperations } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';
import fpsakBehandlingApi from '../data/fpsakBehandlingApi';

const reducerName = 'forstegangOgRevurderingFakta';

const faktaRedux = getFaktaRedux(reducerName);

export const { resetFakta, setOpenInfoPanels } = faktaRedux.actionCreators;

const resolveFaktaAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch(faktaRedux.actionCreators.resolveFaktaAksjonspunkterSuccess());
  return dispatch(sakOperations.updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(fpsakBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true })));
};

export const resolveFaktaAksjonspunkter = (params, behandlingIdentifier) => (dispatch) => {
  dispatch(faktaRedux.actionCreators.resolveFaktaAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const resolveFaktaOverstyrAksjonspunkter = (params, behandlingIdentifier) => (dispatch) => {
  dispatch(faktaRedux.actionCreators.resolveFaktaAksjonspunkterStarted());
  return dispatch(fpsakBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveFaktaAksjonspunkterSuccess(response, behandlingIdentifier)));
};

reducerRegistry.register(reducerName, faktaRedux.reducer);

/* Selectors */
export const { getOpenInfoPanels, getResolveFaktaAksjonspunkterSuccess } = faktaRedux.selectors;
