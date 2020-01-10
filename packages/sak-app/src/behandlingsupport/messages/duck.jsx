import fpsakApi from '../../data/fpsakApi';

// FIXME (TOR) Korleis håndtere dette?
const behandlingUpdater = () => undefined;

export const resetSubmitMessageActionCreator = (behandlingIdentifier) => (dispatch) => {
  dispatch(fpsakApi.SUBMIT_MESSAGE.resetRestApi());
  return behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier);
};

export const submitMessageActionCreator = (params) => (dispatch) => (dispatch(fpsakApi.SUBMIT_MESSAGE.makeRestApiRequest()(params)));
