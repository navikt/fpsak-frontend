// TODO (TOR) Refaktorer
class SakOperations {
    updateFagsakInfo;

    withUpdateFagsakInfo = (updateFagsakInfo) => {
      this.updateFagsakInfo = updateFagsakInfo;
      return this;
    }
}

export default new SakOperations();
