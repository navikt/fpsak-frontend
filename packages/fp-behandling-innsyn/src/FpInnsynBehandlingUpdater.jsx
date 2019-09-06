import innsynBehandlingApi from './data/innsynBehandlingApi';
import { resetBehandling, updateBehandling } from './duckBehandlingInnsyn';

class FpInnsynBehandlingResolver {
    updateBehandling = () => updateBehandling;

    resetBehandling = () => resetBehandling;

    setBehandlingResult = () => innsynBehandlingApi.BEHANDLING.setDataRestApi();
}

export default new FpInnsynBehandlingResolver();
