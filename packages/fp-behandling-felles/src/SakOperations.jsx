// TODO (TOR) Refaktorer
class SakOperations {
    updateFagsakInfo;

    setRequestPollingMessage;

    withUpdateFagsakInfo = (updateFagsakInfo) => {
      this.updateFagsakInfo = updateFagsakInfo;
      return this;
    }

    withSetRequestPollingMessage = (setRequestPollingMessage) => {
      this.setRequestPollingMessage = setRequestPollingMessage;
      return this;
    }
}

export default new SakOperations();
