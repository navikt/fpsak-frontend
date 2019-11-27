import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

import innsynBehandlingApi from '../data/innsynBehandlingApi';

const reducerName = 'innsynBehandlingsprosess';

const behandlingsprosessRedux = getBehandlingsprosessRedux(reducerName);

reducerRegistry.register(reducerName, behandlingsprosessRedux.reducer);

const resolveProsessAksjonspunkterSuccess = () => (dispatch) => dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterSuccess());

export const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => {
  dispatch(behandlingsprosessRedux.actionCreators.resolveProsessAksjonspunkterStarted());
  return dispatch(innsynBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => dispatch(resolveProsessAksjonspunkterSuccess()));
};

export const fetchPreviewBrev = innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

export const { resetBehandlingspunkter, setSelectedBehandlingspunktNavn } = behandlingsprosessRedux.actionCreators;
export const { getSelectedBehandlingspunktNavn, getResolveProsessAksjonspunkterSuccess, getOverrideBehandlingspunkter } = behandlingsprosessRedux.selectors;
