import klageBehandlingApi from './data/klageBehandlingApi';
import { updateBehandling, resetBehandling } from './duckKlage';

class FpSakBehandlingUpdater {
    changeBehandlendeEnhet = () => klageBehandlingApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => klageBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => klageBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => klageBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    openBehandlingForChanges = () => klageBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest();

    setBehandlingResult = () => klageBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => klageBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => klageBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = klageBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpSakBehandlingUpdater();
