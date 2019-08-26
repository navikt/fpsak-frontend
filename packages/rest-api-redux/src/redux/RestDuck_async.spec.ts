import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Dispatch } from 'redux';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';

import {
  getAxiosHttpClientApi, RequestApi, asyncPollingStatus, RequestConfig,
} from '@fpsak-frontend/rest-api';

import ReduxEvents from './ReduxEvents';
import RestDuck from './RestDuck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const reduxEvents = new ReduxEvents();

interface Action {
  type: string;
  meta?: {
    options: {
      keepData: boolean;
    };
  };
  payload?: any;
}

interface Store {
  dispatch: (dispatch: Dispatch) => Promise<{type: any; payload: any}>;
  getActions: () => Action[];
}


const createStore = (): Store => mockStore();

describe('RestDuck (async)', () => {
  let sandbox;
  let mockAxios;

  const httpClientApi = getAxiosHttpClientApi();

  before(() => {
    sandbox = sinon.createSandbox();
    mockAxios = new MockAdapter(httpClientApi.axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    sandbox.restore();
    mockAxios.restore();
  });

  const ressursEndpoint = '/api/ressurs';
  const ressursEndpointIncludingContextPath = `/fpsak${ressursEndpoint}`;

  const resultKeyActionCreators = undefined;

  it('skal returnere resultatet direkte og så sette flagg for started og finished og legge ressurs i state', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        resource: 'resource',
      });
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestFinished());
        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);

        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        const stateAfterRequestFinished = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestFinishedAction);
        expect(stateAfterRequestFinished).to.eql({
          data: {
            resource: 'resource',
          },
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: false,
          finished: true,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });
      });
  });

  it('skal først få ACCEPTED og så motta resultatet etter første polling før enn legger ressurs i state', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, data);
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestStatusStartedAction, requestStatusFinishedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestStatusStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestStarted());
        expect(requestStatusFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestFinished());
        expect(requestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestFinished());

        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: false,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterRequestStatusStarted = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestStatusStartedAction);
        expect(stateAfterRequestStatusStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: false,
          statusRequestStarted: true,
          pollingTimeout: false,
        });
        const stateAfterRequestStatusFinished = asyncGetRessursDuck.reducer(stateAfterRequestStatusStarted, requestStatusFinishedAction);
        expect(stateAfterRequestStatusFinished).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterRequestFinished = asyncGetRessursDuck.reducer(stateAfterRequestStatusFinished, requestFinishedAction);
        expect(stateAfterRequestFinished).to.eql({
          data: {
            resource: 'resource',
          },
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: false,
          finished: true,
          pollingMessage: undefined,
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });
      });
  });

  it('skal først få ACCEPTED og så polle etter resultat to ganger før resultatet blir returnert og lagt i state', () => {
    // Init kall som returnerer 202 - ACCPTED.
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(202, { resource: 'resource' }, { location: 'status-url' });
    // Polling kall som returnerer 200 og status PENDING. Resultat er ennå ikke klart.
    mockAxios
      .onGet('status-url')
      .replyOnce(200, { status: asyncPollingStatus.PENDING, message: 'Polling pågår', pollIntervalMillis: 0 });
    // Polling kall som returnerer 200 og resultatet. (Egentlig vil det bli utført en  redirect, men det skjer utenfor testbar kode.)
    mockAxios
      .onGet('status-url')
      .replyOnce(200, { resource: 'resource' });

    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint, { maxPollingLimit: 200 }).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [
          requestStartedAction,
          firstStatusRequestStartedAction,
          firstStatusRequestFinishedAction,
          updatePollingMessageAction,
          secondStatusRequestStartedAction,
          secondStatusRequestFinishedAction,
          requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(firstStatusRequestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestStarted());
        expect(firstStatusRequestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestFinished());
        expect(updatePollingMessageAction.type).to.eql(asyncGetRessursDuck.actionTypes.updatePollingMessage());
        expect(secondStatusRequestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestStarted());
        expect(secondStatusRequestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestFinished());
        expect(requestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestFinished());
        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: false,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterRequestStatusStarted = asyncGetRessursDuck.reducer(stateAfterRequestStarted, firstStatusRequestStartedAction);
        expect(stateAfterRequestStatusStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: false,
          statusRequestStarted: true,
          pollingTimeout: false,
        });
        const stateAfterRequestStatusFinished = asyncGetRessursDuck.reducer(stateAfterRequestStatusStarted, firstStatusRequestFinishedAction);
        expect(stateAfterRequestStatusFinished).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: undefined,
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterUpdatePollingMessageAction = asyncGetRessursDuck.reducer(stateAfterRequestStatusFinished, updatePollingMessageAction);
        expect(stateAfterUpdatePollingMessageAction).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: 'Polling pågår',
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterSecondStatusRequestStartedAction = asyncGetRessursDuck
          .reducer(stateAfterUpdatePollingMessageAction, secondStatusRequestStartedAction);
        expect(stateAfterSecondStatusRequestStartedAction).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: 'Polling pågår',
          statusRequestFinished: false,
          statusRequestStarted: true,
          pollingTimeout: false,
        });
        const stateAfterSecondStatusRequestFinishedAction = asyncGetRessursDuck
          .reducer(stateAfterSecondStatusRequestStartedAction, secondStatusRequestFinishedAction);
        expect(stateAfterSecondStatusRequestFinishedAction).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          pollingMessage: 'Polling pågår',
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });

        const stateAfterRequestFinished = asyncGetRessursDuck.reducer(stateAfterSecondStatusRequestFinishedAction, requestFinishedAction);
        expect(stateAfterRequestFinished).to.eql({
          data: {
            resource: 'resource',
          },
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: false,
          finished: true,
          pollingMessage: undefined,
          statusRequestFinished: true,
          statusRequestStarted: false,
          pollingTimeout: false,
        });
      });
  });

  it('skal utføre kall mot alle urler i konvolutt', () => {
    const links = [{
      href: 'personopplysningerUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'personopplysninger',
    }, {
      href: 'medlemUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'medlem',
    }];

    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        behandlingId: 1,
        versjon: 2,
        links,
      });
    mockAxios
      .onGet('personopplysningerUrl')
      .reply(200, {
        fodseldato: '10.10.2011',
      });
    mockAxios
      .onGet('medlemUrl')
      .reply(200, {
        harMedlemskap: true,
      });
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint, { fetchLinkDataAutomatically: true }).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestFinishedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestFinished());

        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });
        const stateAfterRequestFinished = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestFinishedAction);

        expect(stateAfterRequestFinished).to.eql({
          data: {
            behandlingId: 1,
            versjon: 2,
            links,
            [links[0].rel]: { fodseldato: '10.10.2011' },
            [links[1].rel]: { harMedlemskap: true },
          },
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: false,
          finished: true,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });
      });
  });

  it('skal kopiere data i rest-state uten å utføre restkall', async () => {
    const links = [{
      href: 'personopplysningerUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'personopplysninger',
    }, {
      href: 'medlemUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'medlem',
    }];

    const behandling = {
      behandlingId: 1,
      versjon: 2,
      links,
      [links[0].rel]: { fodseldato: '10.10.2011' },
      [links[1].rel]: { harMedlemskap: true },
    };

    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };

    const result = await store.dispatch(asyncGetRessursDuck.actionCreators.execSetData(behandling, params));
    expect(result.type).to.eql(asyncGetRessursDuck.actionTypes.copyDataFinished());
    expect(result.payload).to.eql(behandling);
  });

  it('skal håndtere feil ved initielt rest-kall', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(500, 'Request failed with status code 500');
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .catch(() => {
        const [requestStartedAction, requestErrorAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestErrorAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestError());

        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        const stateAfterRequestError = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestErrorAction);
        expect(stateAfterRequestError).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: stateAfterRequestError.error,
          started: false,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        expect(stateAfterRequestError.error ? stateAfterRequestError.error.message : '').is.eql('Request failed with status code 500');
      });
  });

  it('skal håndtere status 418 som blir brukt ved HALTED/DELAYED i long-pollinga', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(418, 'Request failed with status code 418');
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .catch(() => {
        const [requestStartedAction, requestStatusStartedAction, requestErrorAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestStatusStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.statusRequestStarted());
        expect(requestErrorAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestError());

        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        const stateAfterStatusRequestStarted = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestStatusStartedAction);
        expect(stateAfterStatusRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: true,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        const stateAfterRequestError = asyncGetRessursDuck.reducer(stateAfterStatusRequestStarted, requestErrorAction);
        expect(stateAfterRequestError).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: stateAfterRequestError.error,
          started: false,
          finished: false,
          statusRequestStarted: true,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        expect(stateAfterRequestError.error).is.eql('Request failed with status code 418');
      });
  });

  it('skal håndtere feil ved restkall som ligg i konvolutt', () => {
    const links = [{
      href: 'personopplysningerUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'personopplysninger',
    }, {
      href: 'medlemUrl', type: 'GET', requestPayload: { behandlingId: 1 }, rel: 'medlem',
    }];

    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        behandlingId: 1,
        versjon: 2,
        links,
      });
    mockAxios
      .onGet('personopplysningerUrl')
      .reply(418);
    mockAxios
      .onGet('medlemUrl')
      .reply(200, {
        harMedlemskap: true,
      });
    const store = createStore();

    const config = {
      maxPollingLimit: undefined,
      fetchLinkDataAutomatically: true,
      addLinkDataToArray: false,
    };
    const requestConfig = new RequestConfig('ressurs', ressursEndpoint, config).withGetAsyncMethod();

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const asyncGetRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(asyncGetRessursDuck.actionCreators.execRequest(params))
      .catch(() => {
        const [requestStartedAction, requestErrorAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestStarted());
        expect(requestErrorAction.type).to.eql(asyncGetRessursDuck.actionTypes.requestError());

        const stateAfterRequestStarted = asyncGetRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });

        const stateAfterRequestError = asyncGetRessursDuck.reducer(stateAfterRequestStarted, requestErrorAction);
        expect(stateAfterRequestError).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: stateAfterRequestError.error,
          started: false,
          finished: false,
          statusRequestStarted: false,
          statusRequestFinished: false,
          pollingMessage: undefined,
          pollingTimeout: false,
        });
      });
  });
});
