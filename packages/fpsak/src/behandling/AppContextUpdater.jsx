import { updateFagsakInfo } from 'fagsak/duck';
import { setRequestPollingMessage } from 'app/pollingMessageDuck';

class AppContextUpdater {
    updateFagsakInfo = updateFagsakInfo;

    setRequestPollingMessage = setRequestPollingMessage;
}

export default new AppContextUpdater();
