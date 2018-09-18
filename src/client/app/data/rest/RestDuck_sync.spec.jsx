import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import RestDuck from './RestDuck';
import { get } from './restMethods';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('RestDuck (sync)', () => {
  const timestamp = moment.now();
  let sandbox;
  let clock;
  let mockAxios;

  before(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(timestamp);
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    sandbox.restore();
    clock.restore();
    mockAxios.restore();
  });

  const ressursEndpoint = '/api/ressurs';

  it('skal sette flagg for started og finished og legge ressurs i state', () => {
    mockAxios
      .onGet(ressursEndpoint)
      .reply(200, {
        resource: 'resource',
      });
    const store = mockStore();

    const getRessursDuck = new RestDuck('ressurs', ressursEndpoint, get);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted);
        expect(requestFinishedAction.type).to.eql(getRessursDuck.actionTypes.requestFinished);

        const stateAfterRequestStarted = getRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp },
          error: undefined,
          started: true,
          finished: false,
        });

        const stateAfterRequestFinished = getRessursDuck.reducer(stateAfterRequestStarted, requestFinishedAction);
        expect(stateAfterRequestFinished).to.eql({
          data: {
            resource: 'resource',
          },
          meta: { params, timestamp },
          error: undefined,
          started: false,
          finished: true,
        });
      });
  });

  it('skal sette flagg for started og og legge feil i state', () => {
    mockAxios
      .onGet(ressursEndpoint)
      .reply(404, {
        message: 'Resource not found',
      });
    const store = mockStore();

    const getRessursDuck = new RestDuck('ressurs', ressursEndpoint, get);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .catch(() => {
        const [requestStartedAction, requestErrorAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted);
        expect(requestErrorAction.type).to.eql(getRessursDuck.actionTypes.requestError);

        const stateAfterRequestStarted = getRessursDuck.reducer(undefined, requestStartedAction);
        expect(stateAfterRequestStarted).to.eql({
          data: undefined,
          meta: { params, timestamp },
          error: undefined,
          started: true,
          finished: false,
        });

        const stateAfterRequestError = getRessursDuck.reducer(stateAfterRequestStarted, requestErrorAction);
        const expected = {
          data: undefined,
          meta: { params, timestamp },
          error: {
            message: 'Resource not found',
          },
          started: false,
          finished: false,
        };
        expect(stateAfterRequestError).to.eql(expected);
      });
  });

  it('skal resette data ved ny request', () => {
    mockAxios
      .onGet(ressursEndpoint)
      .reply(200, {
        resource: 'resource',
      });
    const store = mockStore();

    const getRessursDuck = new RestDuck('ressurs', ressursEndpoint, get);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted);

        const stateBeforeRequest = {
          data: 'noe_data',
        };

        const stateAfterRequestStarted = getRessursDuck.reducer(stateBeforeRequest, requestStartedAction);
        expect(stateAfterRequestStarted).to.have.property('data', undefined);
      });
  });

  it('skal beholde data ved ny request hvis "keepData"-flagget er satt', () => {
    mockAxios
      .onGet(ressursEndpoint)
      .reply(200, {
        resource: 'resource',
      });
    const store = mockStore();

    const getRessursDuck = new RestDuck('ressurs', ressursEndpoint, get);

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params, { keepData: true }))
      .then(() => {
        const [requestStartedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted);

        const stateBeforeRequest = {
          data: 'noe_data',
        };

        const stateAfterRequestStarted = getRessursDuck.reducer(stateBeforeRequest, requestStartedAction);
        expect(stateAfterRequestStarted).to.have.property('data', 'noe_data');
      });
  });

  it('selctors skal hente ut state', () => {
    mockAxios
      .onGet(ressursEndpoint)
      .reply(200, {
        resource: 'resource',
      });
    const store = mockStore();

    const getApiContext = state => state.dataContext;
    const getRessursDuck = new RestDuck('ressurs', ressursEndpoint, get, getApiContext);

    // Unpack to named selectors
    const getRessursData = state => getRessursDuck.stateSelector(state).data;
    const getRessursMeta = state => getRessursDuck.stateSelector(state).meta;
    const getRessursError = state => getRessursDuck.stateSelector(state).error;
    const getRessursStarted = state => getRessursDuck.stateSelector(state).started;
    const getRessursFinished = state => getRessursDuck.stateSelector(state).finished;

    const params = { id: 'id' };
    return store.dispatch(getRessursDuck.actionCreators.execRequest(params))
      .then(() => {
        const [requestStartedAction, requestFinishedAction] = store.getActions();
        expect(requestStartedAction.type).to.eql(getRessursDuck.actionTypes.requestStarted);
        expect(requestFinishedAction.type).to.eql(getRessursDuck.actionTypes.requestFinished);

        const stateAfterRequestStarted = {
          dataContext: {
            ressurs: getRessursDuck.reducer(undefined, requestStartedAction),
          },
        };

        expect(getRessursData(stateAfterRequestStarted)).to.be.undefined;
        expect(getRessursMeta(stateAfterRequestStarted)).to.be.eql({ params, timestamp });
        expect(getRessursError(stateAfterRequestStarted)).to.be.undefined;
        expect(getRessursStarted(stateAfterRequestStarted)).to.eql(true);
        expect(getRessursFinished(stateAfterRequestStarted)).to.eql(false);

        const stateAfterRequestFinished = {
          dataContext: {
            ressurs: getRessursDuck.reducer(getRessursDuck.stateSelector(stateAfterRequestStarted), requestFinishedAction),
          },
        };

        expect(getRessursData(stateAfterRequestFinished)).to.be.eql({ resource: 'resource' });
        expect(getRessursMeta(stateAfterRequestFinished)).to.be.eql({ params, timestamp });
        expect(getRessursError(stateAfterRequestFinished)).to.be.undefined;
        expect(getRessursStarted(stateAfterRequestFinished)).to.eql(false);
        expect(getRessursFinished(stateAfterRequestFinished)).to.eql(true);
      });
  });
});
