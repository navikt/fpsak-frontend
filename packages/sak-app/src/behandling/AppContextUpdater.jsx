import { updateFagsakInfo } from '../fagsak/duck';

class AppContextUpdater {
    updateFagsakInfo = updateFagsakInfo;
}

export default new AppContextUpdater();
