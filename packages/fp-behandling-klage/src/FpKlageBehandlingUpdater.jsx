import klageBehandlingApi from './data/klageBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingKlage';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => klageBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => klageBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
}

export default new FpSakBehandlingUpdater();
