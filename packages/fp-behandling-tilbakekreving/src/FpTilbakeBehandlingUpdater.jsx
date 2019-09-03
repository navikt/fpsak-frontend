import tilbakekrevingBehandlingApi from './data/tilbakekrevingBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingTilbakekreving';

class FpTilbakeBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => tilbakekrevingBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();

    resetSubmitMessage = () => tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.resetRestApi();

    submitMessage = () => tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.makeRestApiRequest();

    isSubmitMessageFinished = tilbakekrevingBehandlingApi.SUBMIT_MESSAGE.getRestApiFinished();
}

export default new FpTilbakeBehandlingUpdater();
