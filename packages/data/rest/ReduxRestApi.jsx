import { combineReducers } from 'redux';
import {
  get, post, postAndOpenBlob, getAsync, postAsync, put, putAsync,
} from './restMethods';
import RestDuck from './RestDuck';

class ReduxRestApi {
  constructor(endpoints, getRestApiState) {
    this.createReducer = this.createReducer.bind(this);
    this.getEndpoint = this.getEndpoint.bind(this);
    this.makeRequestActionCreator = this.makeRequestActionCreator.bind(this);
    this.setDataActionCreator = this.setDataActionCreator.bind(this);
    this.makeResetActionCreator = this.makeResetActionCreator.bind(this);
    this.getEndpointState = this.getEndpointState.bind(this);
    this.ducks = endpoints.map(({ name, path, restMethod }) => new RestDuck(name, path, restMethod, getRestApiState));
  }

  createReducer() {
    const reducers = this.ducks
      .map(duck => ({ [duck.name]: duck.reducer }))
      .reduce((a, b) => ({ ...a, ...b }), {});
    return combineReducers(reducers);
  }

  getEndpoint(endpointName) {
    return this.ducks.find(duck => duck.name === endpointName)
      || { actionCreators: {} };
  }

  makeRequestActionCreator(endpointName) {
    return this.getEndpoint(endpointName).actionCreators.execRequest;
  }

  setDataActionCreator(endpointName) {
    return this.getEndpoint(endpointName).actionCreators.execSetData;
  }

  makeResetActionCreator(endpointName) {
    return this.getEndpoint(endpointName).actionCreators.reset;
  }

  getEndpointState(endpointName) {
    return this.getEndpoint(endpointName).stateSelector;
  }

  static build() {
    class RestApiBuilder {
      constructor() {
        this.withGet = this.withGet.bind(this);
        this.withAsyncGet = this.withAsyncGet.bind(this);
        this.withPost = this.withPost.bind(this);
        this.withAsyncPost = this.withAsyncPost.bind(this);
        this.withPut = this.withPut.bind(this);
        this.withAsyncPut = this.withAsyncPut.bind(this);
        this.withPostAndOpenBlob = this.withPostAndOpenBlob.bind(this);
        this.withRestApiSelector = this.withRestApiSelector.bind(this);
        this.endpoints = [];
      }

      withGet(path, name) {
        this.endpoints.push({ path, name, restMethod: get });
        return this;
      }

      withAsyncGet(path, name) {
        this.endpoints.push({ path, name, restMethod: getAsync });
        return this;
      }

      withPost(path, name) {
        this.endpoints.push({ path, name, restMethod: post });
        return this;
      }

      withAsyncPost(path, name) {
        this.endpoints.push({ path, name, restMethod: postAsync });
        return this;
      }

      withPut(path, name) {
        this.endpoints.push({ path, name, restMethod: put });
        return this;
      }

      withAsyncPut(path, name) {
        this.endpoints.push({ path, name, restMethod: putAsync });
        return this;
      }

      withPostAndOpenBlob(path, name) {
        this.endpoints.push({ path, name, restMethod: postAndOpenBlob });
        return this;
      }

      withRestApiSelector(restApiSelector) {
        this.restApiSelector = restApiSelector;
        return this;
      }

      create() {
        return new ReduxRestApi(
          this.endpoints,
          this.restApiSelector,
        );
      }
    }

    return new RestApiBuilder();
  }
}

export default ReduxRestApi;
