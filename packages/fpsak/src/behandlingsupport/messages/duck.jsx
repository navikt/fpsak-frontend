import fpsakApi from 'data/fpsakApi';
import { updateFagsakInfo } from 'fagsak/duck';
import { updateBehandling } from 'behandling/duck';

const resetSubmitMessage = behandlingIdentifier => (dispatch) => {
  dispatch(fpsakApi.SUBMIT_MESSAGE.resetRestApi());
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(updateBehandling(behandlingIdentifier)));
};

export default resetSubmitMessage;
