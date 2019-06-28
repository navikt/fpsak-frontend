import ankeBehandlingApi from './data/ankeBehandlingApi';
import { updateBehandling, resetBehandling } from './duckAnke';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => ankeBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => ankeBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => ankeBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = ankeBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpSakBehandlingUpdater();
