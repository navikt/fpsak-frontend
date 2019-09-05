import ankeBehandlingApi from './data/ankeBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingAnke';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => ankeBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => ankeBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
}

export default new FpSakBehandlingUpdater();
