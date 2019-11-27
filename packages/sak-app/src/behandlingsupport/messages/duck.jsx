import behandlingUpdater from '../../behandling/BehandlingUpdater';
import fpsakApi from '../../data/fpsakApi';

export const resetSubmitMessageActionCreator = (behandlingIdentifier) => (dispatch) => {
  dispatch(fpsakApi.SUBMIT_MESSAGE.resetRestApi());
  return behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier);
};

export const submitMessageActionCreator = (params) => (dispatch) => (dispatch(fpsakApi.SUBMIT_MESSAGE.makeRestApiRequest()(params)));
