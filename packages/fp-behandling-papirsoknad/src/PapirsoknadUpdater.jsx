import papirsoknadApi from './data/papirsoknadApi';
import { updateBehandling, resetBehandling } from './duck';

class PapirsoknadUpdater {
    changeBehandlendeEnhet = () => papirsoknadApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => papirsoknadApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => papirsoknadApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => papirsoknadApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    setBehandlingResult = () => papirsoknadApi.BEHANDLING.setDataRestApi();

    previewMessage = () => papirsoknadApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => papirsoknadApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => papirsoknadApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = () => papirsoknadApi.SUBMIT_MESSAGE.makeRestApiRequest();
}

export default new PapirsoknadUpdater();
