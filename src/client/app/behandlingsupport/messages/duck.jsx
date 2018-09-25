import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';
import { resetRestApi } from '@fpsak-frontend/data/duck';
import { updateFagsakInfo } from 'fagsak/duck';
import { updateBehandling } from 'behandling/duck';

const resetSubmitMessage = behandlingIdentifier => (dispatch) => {
  dispatch(resetRestApi(FpsakApi.SUBMIT_MESSAGE));
  return dispatch(updateFagsakInfo(behandlingIdentifier.saksnummer))
    .then(() => dispatch(updateBehandling(behandlingIdentifier)));
};

export default resetSubmitMessage;
