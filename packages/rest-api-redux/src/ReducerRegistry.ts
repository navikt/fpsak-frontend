// TODO (TOR) Flytt ut i utility-pakke, evt. anna pakke.
class ReducerRegistry {
  emitChange: (reducers: {}) => void;

  reducers: {[key: string]: {}};

  constructor() {
    this.emitChange = null;
    this.reducers = {};
  }

  getReducers() {
    return { ...this.reducers };
  }

  register(name, reducer) {
    this.reducers = { ...this.reducers, [name]: reducer };
    if (this.emitChange) {
      this.emitChange(this.getReducers());
    }
  }

  setChangeListener(listener) {
    this.emitChange = listener;
  }

  // Kun for test
  clear() {
    this.emitChange = null;
    this.reducers = {};
  }
}

const reducerRegistry = new ReducerRegistry();
export default reducerRegistry;
