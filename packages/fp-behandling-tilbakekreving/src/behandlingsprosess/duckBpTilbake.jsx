import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import tilbakekrevingBehandlingApi from '../data/tilbakekrevingBehandlingApi';

const reducerName = 'tilbakekrevingBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = (response, behandlingIdentifier) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());
  return dispatch(tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi()(response.payload, behandlingIdentifier.toJson(), { keepData: true }));
};

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(tilbakekrevingBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params))
    .then((response) => dispatch(resolveProsessAksjonspunkterSuccess(response, behandlingIdentifier)));
};

export const beregnBeløp = (params) => (dispatch) => dispatch(tilbakekrevingBehandlingApi.BEREGNE_BELØP.makeRestApiRequest()(params))
  .then((response) => response.payload);

export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn } = behandlingsprosessRedux.actionCreators;
export const { getSelectedBehandlingspunktNavn, getResolveProsessAksjonspunkterSuccess, getOverrideBehandlingspunkter } = behandlingsprosessRedux.selectors;
