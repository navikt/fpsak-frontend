import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Dispatch } from 'redux';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';

import { getAxiosHttpClientApi, RequestApi, RequestConfig } from '@fpsak-frontend/rest-api';

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
  dispatch: (dispatch: Dispatch) => Promise<{payload: any}>;
  getActions: () => Action[];
}

const getAsyncDefaultProps = {
  pollingMessage: undefined,
  pollingTimeout: false,
  statusRequestFinished: false,
  statusRequestStarted: false,
  cacheParams: undefined,
  previousData: undefined,
};

const createStore = (): Store => mockStore();

const resultKeyActionCreators = undefined;

describe('RestDuck (sync)', () => {
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

  it('skal sette flagg for started og finished og legge ressurs i state', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        resource: 'resource',
      });
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint);

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const getRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted());
        expect(requestFinishedAction.type).to.eql(getRessursDuck.actionTypes.requestFinished());

        const stateAfterRequestStarted = getRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          ...getAsyncDefaultProps,
        });

        const stateAfterRequestFinished = getRessursDuck.reducer(stateAfterRequestStarted, requestFinishedAction);
        expect(stateAfterRequestFinished).to.eql({
          data: {
            resource: 'resource',
          },
          meta: { params, timestamp: stateAfterRequestFinished.meta.timestamp },
          error: undefined,
          started: false,
          finished: true,
          ...getAsyncDefaultProps,
        });
      });
  });

  it('skal sette flagg for started og og legge feil i state', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(404, 'Resource not found');
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint);

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const getRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .catch(() => {
        const [requestStartedAction, requestErrorAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted());
        expect(requestErrorAction.type).to.eql(getRessursDuck.actionTypes.requestError());

        const stateAfterRequestStarted = getRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp: stateAfterRequestStarted.meta.timestamp },
          error: undefined,
          started: true,
          finished: false,
          ...getAsyncDefaultProps,
        });

        const stateAfterRequestError = getRessursDuck.reducer(stateAfterRequestStarted, requestErrorAction);
        const expected = {
          data: undefined,
          meta: { params, timestamp: stateAfterRequestError.meta.timestamp },
          error: {
            location: '/fpsak/api/ressurs',
          },
          started: false,
          finished: true,
          ...getAsyncDefaultProps,
        };
        expect(stateAfterRequestError).to.eql(expected);
      });
  });

  it('skal resette data ved ny request', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        resource: 'resource',
      });
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint);

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const getRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted());

        const stateBeforeRequest = {
          data: 'noe_data',
          meta: {},
          started: false,
          finished: false,
        };

        const stateAfterRequestStarted = getRessursDuck.reducer(stateBeforeRequest, requestStartedAction);
        expect(stateAfterRequestStarted).to.have.property('data', undefined);
      });
  });

  it('skal beholde data ved ny request hvis "keepData"-flagget er satt', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        resource: 'resource',
      });
    const store = createStore();

    const requestConfig = new RequestConfig('ressurs', ressursEndpoint);

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const getRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), sinon.spy(), reduxEvents, resultKeyActionCreators);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params, { keepData: true }))
      .then(() => {
        const [requestStartedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted());

        const stateBeforeRequest = {
          data: 'noe_data',
          meta: {},
          started: false,
          finished: false,
        };

        const stateAfterRequestStarted = getRessursDuck.reducer(stateBeforeRequest, requestStartedAction);
        expect(stateAfterRequestStarted).to.have.property('data', 'noe_data');
      });
  });

  it('selectors skal hente ut state', () => {
    mockAxios
      .onGet(ressursEndpointIncludingContextPath)
      .reply(200, {
        resource: 'resource',
      });
    const store = createStore();

    const getApiContext = (state) => state.dataContext;
    const requestConfig = new RequestConfig('ressurs', ressursEndpoint);

    const requestApi = new RequestApi(httpClientApi, 'fpsak', [requestConfig]);
    const getRessursDuck = new RestDuck(requestApi.getRequestRunner(requestConfig.name), getApiContext, reduxEvents, resultKeyActionCreators);

    // Unpack to named selectors
    const getRessursData = (state) => getRessursDuck.stateSelector(state).data;
    const getRessursMeta = (state) => getRessursDuck.stateSelector(state).meta;
    const getRessursError = (state) => getRessursDuck.stateSelector(state).error;
    const getRessursStarted = (state) => getRessursDuck.stateSelector(state).started;
    const getRessursFinished = (state) => getRessursDuck.stateSelector(state).finished;

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted());
        expect(requestFinishedAction.type).to.eql(getRessursDuck.actionTypes.requestFinished());

        const stateAfterRequestStarted = {
          dataContext: {
            ressurs: getRessursDuck.reducer(undefined, requestStartedAction),
          },
        };

        // eslint-disable-next-line no-unused-expressions
        expect(getRessursData(stateAfterRequestStarted)).to.be.undefined;
        expect(getRessursMeta(stateAfterRequestStarted).params).to.be.eql(params);
        // eslint-disable-next-line no-unused-expressions
        expect(getRessursError(stateAfterRequestStarted)).to.be.undefined;
        expect(getRessursStarted(stateAfterRequestStarted)).to.eql(true);
        expect(getRessursFinished(stateAfterRequestStarted)).to.eql(false);

        const stateAfterRequestFinished = {
          dataContext: {
            ressurs: getRessursDuck.reducer(getRessursDuck.stateSelector(stateAfterRequestStarted), requestFinishedAction),
          },
        };

        expect(getRessursData(stateAfterRequestFinished)).to.be.eql({ resource: 'resource' });
        expect(getRessursMeta(stateAfterRequestFinished).params).to.be.eql(params);
        // eslint-disable-next-line no-unused-expressions
        expect(getRessursError(stateAfterRequestFinished)).to.be.undefined;
        expect(getRessursStarted(stateAfterRequestFinished)).to.eql(false);
        expect(getRessursFinished(stateAfterRequestFinished)).to.eql(true);
      });
  });
});
