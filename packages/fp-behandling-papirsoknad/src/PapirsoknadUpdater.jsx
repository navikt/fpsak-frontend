import papirsoknadApi from './data/papirsoknadApi';
import { resetBehandling, updateBehandling } from './duckPapirsoknad';

class PapirsoknadUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => papirsoknadApi.BEHANDLING.setDataRestApi();

    previewMessage = () => papirsoknadApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => papirsoknadApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => papirsoknadApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = () => papirsoknadApi.SUBMIT_MESSAGE.makeRestApiRequest();
}

export default new PapirsoknadUpdater();
