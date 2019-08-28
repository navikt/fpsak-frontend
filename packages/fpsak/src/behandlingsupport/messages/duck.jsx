import { updateFagsakInfo } from 'fagsak/duck';
import behandlingUpdater from 'behandling/BehandlingUpdater';

export const resetSubmitMessageActionCreator = (behandlingIdentifier) => (dispatch) => {
  behandlingUpdater.resetSubmitMessage(dispatch);
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => behandlingUpdater.updateBehandling(dispatch, behandlingIdentifier));
};

export const previewMessageActionCreator = (params) => (dispatch) => behandlingUpdater.previewMessage(dispatch, params);
export const submitMessageActionCreator = (params) => (dispatch) => behandlingUpdater.submitMessage(dispatch, params);

export const isSubmitMessageFinished = (state) => behandlingUpdater.isSubmitMessageFinished(state);
