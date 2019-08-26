import klageBehandlingApi from './data/klageBehandlingApi';
import { updateBehandling, resetBehandling } from './duckBehandlingKlage';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => klageBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => klageBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => klageBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = klageBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpSakBehandlingUpdater();
