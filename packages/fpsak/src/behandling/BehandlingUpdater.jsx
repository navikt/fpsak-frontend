class BehandlingUpdater {
    setUpdater = (updater) => {
      this.updater = updater;
    }

    reset = () => {
      this.updater = undefined;
    }

    changeBehandlendeEnhet = (dispatch, params) => dispatch(this.updater.changeBehandlendeEnhet()(params))

    updateBehandling = (dispatch, behandlingIdentifier) => dispatch(this.updater.updateBehandling()(behandlingIdentifier))

    resetBehandling = dispatch => dispatch(this.updater.resetBehandling())

    setBehandlingOnHold = (dispatch, params) => dispatch(this.updater.setBehandlingOnHold()(params))

    resumeBehandling = (dispatch, params) => dispatch(this.updater.resumeBehandling()(params))

    shelveBehandling = dispatch => dispatch(this.updater.shelveBehandling())

    openBehandlingForChanges = (dispatch, params) => dispatch(this.updater.openBehandlingForChanges()(params))
}

export default new BehandlingUpdater();
