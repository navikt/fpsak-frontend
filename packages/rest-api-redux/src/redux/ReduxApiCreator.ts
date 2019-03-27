import { combineReducers } from 'redux';

import { RequestApi } from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import RestDuck from './RestDuck';

class ReduxApiCreator {
  ducks: RestDuck[]

  constructor(requestApi: RequestApi, getRestApiState: (state: any) => any, reduxEvents: ReduxEvents) {
    const endpointNames = requestApi.getEndpointNames();
    this.ducks = endpointNames.map(endpointName => new RestDuck(requestApi.getRequestRunner(endpointName), getRestApiState, reduxEvents));
  }

  createReducer = (): any => {
    const reducers = this.ducks
      .map(duck => ({ [duck.name]: duck.reducer }))
      .reduce((a, b) => ({ ...a, ...b }), {});
    return combineReducers(reducers);
  }

  getEndpoint = (endpointName: string) => this.ducks.find(duck => duck.name === endpointName)
      || { actionCreators: {}, requestRunner: { stopProcess: () => undefined }, stateSelector: {} }

  makeRequestActionCreator = (endpointName: string) => this.getEndpoint(endpointName).actionCreators.execRequest

  // TODO (TOR) Bør fjerne denne og heller kunna konfigurera at ein legg data under anna state-nøkkel
  setDataActionCreator = (endpointName: string) => this.getEndpoint(endpointName).actionCreators.execSetData

  makeResetActionCreator = (endpointName: string) => this.getEndpoint(endpointName).actionCreators.reset

  // TODO (TOR) Skriv om dette. Kanseller lenger ut. Og legg til actionreducer for bedre sporing
  cancelRequest = (endpointName: string) => this.getEndpoint(endpointName).requestRunner.stopProcess()

  getEndpointState = (endpointName: string) => this.getEndpoint(endpointName).stateSelector
}

export default ReduxApiCreator;
