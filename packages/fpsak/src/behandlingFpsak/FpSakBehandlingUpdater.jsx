import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import { updateBehandling, resetBehandling } from './duck';

class FpSakBehandlingUpdater {
    changeBehandlendeEnhet = () => fpsakBehandlingApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => fpsakBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => fpsakBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => fpsakBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    openBehandlingForChanges = () => fpsakBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest();

    setBehandlingResult = () => fpsakBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => fpsakBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => fpsakBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => fpsakBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = fpsakBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpSakBehandlingUpdater();
