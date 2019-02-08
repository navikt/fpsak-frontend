import tilbakekrevingBehandlingApi from './data/tilbakekrevingBehandlingApi';
import { updateBehandling, resetBehandling } from './duckTilbake';

class FpTilbakeBehandlingUpdater {
    changeBehandlendeEnhet = () => tilbakekrevingBehandlingApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => tilbakekrevingBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => tilbakekrevingBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => tilbakekrevingBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    setBehandlingResult = () => tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => tilbakekrevingBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpTilbakeBehandlingUpdater();
