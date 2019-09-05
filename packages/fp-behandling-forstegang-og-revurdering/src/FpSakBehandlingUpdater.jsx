import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingForstegangOgRev';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => fpsakBehandlingApi.BEHANDLING.setDataRestApi();

    previewMessage = () => fpsakBehandlingApi.PREVIEW_MESSAGE.makeRestApiRequest();
}

export default new FpSakBehandlingUpdater();
