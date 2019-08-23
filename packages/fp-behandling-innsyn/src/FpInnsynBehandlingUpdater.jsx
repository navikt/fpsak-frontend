import innsynBehandlingApi from './data/innsynBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingInnsyn';

class FpInnsynBehandlingResolver {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => innsynBehandlingApi.BEHANDLING.setDataRestApi();

<<<<<<< HEAD
    previewMessage = () => innsynBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
=======
    resetSubmitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => innsynBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = innsynBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
>>>>>>> TFP-481 Gå til fpformidling for forhandsvis
}

export default new FpInnsynBehandlingResolver();
