import papirsoknadApi from './data/papirsoknadApi';
import { resetBehandling, updateBehandling } from './duckPapirsoknad';

class PapirsoknadUpdater {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => papirsoknadApi.BEHANDLING.setDataRestApi();
}

export default new PapirsoknadUpdater();
