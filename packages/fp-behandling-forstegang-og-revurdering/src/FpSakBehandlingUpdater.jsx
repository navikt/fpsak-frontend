import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import { updateBehandling, resetBehandling } from './duck';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => fpsakBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => fpsakBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => fpsakBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => fpsakBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = fpsakBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpSakBehandlingUpdater();
