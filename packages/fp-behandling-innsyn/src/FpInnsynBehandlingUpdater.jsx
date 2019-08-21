import innsynBehandlingApi from './data/innsynBehandlingApi';
import { updateBehandling, resetBehandling } from './duckBehandlingInnsyn';

class FpInnsynBehandlingResolver {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => innsynBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = innsynBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpInnsynBehandlingResolver();
