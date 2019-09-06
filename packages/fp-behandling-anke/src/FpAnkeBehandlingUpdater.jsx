import ankeBehandlingApi from './data/ankeBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingAnke';

class FpSakBehandlingUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => ankeBehandlingApi.BEHANDLING.setDataRestApi();
}

export default new FpSakBehandlingUpdater();
