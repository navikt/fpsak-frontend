import fpsakBehandlingApi from './data/fpsakBehandlingApi';
import { updateBehandling, resetBehandling } from './duck';

class BehandlingUpdaterFpsak {
    changeBehandlendeEnhet = () => fpsakBehandlingApi.NY_BEHANDLENDE_ENHET.makeRestApiRequest();

    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingOnHold = () => fpsakBehandlingApi.BEHANDLING_ON_HOLD.makeRestApiRequest();

    resumeBehandling = () => fpsakBehandlingApi.RESUME_BEHANDLING.makeRestApiRequest();

    shelveBehandling = () => fpsakBehandlingApi.HENLEGG_BEHANDLING.makeRestApiRequest();

    openBehandlingForChanges = () => fpsakBehandlingApi.OPEN_BEHANDLING_FOR_CHANGES.makeRestApiRequest();
}

export default new BehandlingUpdaterFpsak();
