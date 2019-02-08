import innsynBehandlingApi from './data/innsynBehandlingApi';
import { updateBehandling, resetBehandling } from './duckInnsyn';

class FpInnsynBehandlingResolver {
    changeBehandlendeEnhet = () => innsynBehandlingApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => innsynBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => innsynBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => innsynBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    setBehandlingResult = () => innsynBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = innsynBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpInnsynBehandlingResolver();
