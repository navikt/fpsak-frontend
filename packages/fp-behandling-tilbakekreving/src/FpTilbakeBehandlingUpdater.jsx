import tilbakekrevingBehandlingApi from './data/tilbakekrevingBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingTilbakekreving';

class FpTilbakeBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => tilbakekrevingBehandlingApi.BEHANDLING.setDataRestApi();
}

export default new FpTilbakeBehandlingUpdater();
