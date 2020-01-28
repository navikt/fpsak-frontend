import { combineReducers } from 'redux';

import { RequestApi } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import RestDuck from './RestDuck';

const EMPTY_ENDPOINT = {
  actionCreators: {}, requestRunner: { stopProcess: () => undefined, getPath: () => undefined }, stateSelector: {},
};

class ReduxApiCreator {
  ducks: RestDuck[] = []

  constructor(requestApi: RequestApi, getRestApiState: (state: any) => any, reduxEvents: ReduxEvents) {
    const endpointNames = requestApi.getEndpointNames();
    endpointNames.forEach((endpointName) => {
      const requestRunner = requestApi.getRequestRunner(endpointName);
      const { storeResultKey } = requestRunner.getConfig().config;
      const resultKeyActionCreators = storeResultKey ? this.getEndpoint(storeResultKey).actionCreators : undefined;
      this.ducks.push(new RestDuck(requestRunner, getRestApiState, reduxEvents, resultKeyActionCreators));
    });
  }

  createReducer = (): any => {
    const reducers = this.ducks
      .map((duck) => ({ [duck.name]: duck.reducer }))
      .reduce((a, b) => ({ ...a, ...b }), {});
    return combineReducers(reducers);
  }

  getEndpoint = (endpointName: string) => this.ducks.find((duck) => duck.name === endpointName) || EMPTY_ENDPOINT;

  isEndpointEnabled = (endpointName: string): boolean => !!this.getEndpoint(endpointName).requestRunner.getPath();

  makeRequestActionCreator = (endpointName: string) => this.getEndpoint(endpointName).actionCreators.execRequest

  makeResetActionCreator = (endpointName: string) => this.getEndpoint(endpointName).actionCreators.reset

  // TODO (TOR) Skriv om dette. Kanseller lenger ut. Og legg til actionreducer for bedre sporing
  cancelRequest = (endpointName: string) => this.getEndpoint(endpointName).requestRunner.stopProcess()

  getEndpointState = (endpointName: string) => this.getEndpoint(endpointName).stateSelector
}

export default ReduxApiCreator;
