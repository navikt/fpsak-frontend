import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { FpsakApi, getFpsakApiPath } from 'data/fpsakApi';
import {
  behandlingReducer, setSelectedBehandlingId, setHasShownBehandlingPaVent, updateBehandling,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandling-reducer', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
  });

  it('skal returnere initial state', () => {
    expect(behandlingReducer(undefined, {})).to.eql({
      behandlingId: undefined,
      hasShownBehandlingPaVent: false,
    });
  });

  it('skal markere i state at behandling er valgt', () => {
    const store = mockStore();

    store.dispatch(setSelectedBehandlingId(1));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingReducer(undefined, store.getActions()[0])).to.eql({
      behandlingId: 1,
      hasShownBehandlingPaVent: false,
    });
  });

  it('skal markere i state at en har vist at behandlingen er satt på vent', () => {
    const store = mockStore();

    store.dispatch(setHasShownBehandlingPaVent());

    expect(store.getActions()).to.have.length(1);

    expect(behandlingReducer(undefined, store.getActions()[0])).to.eql({
      behandlingId: undefined,
      hasShownBehandlingPaVent: true,
    });
  });

  it('skal hente behandling uten original behandling', () => {
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.BEHANDLING))
      .reply(200, { id: 456, osv: 'osv' });

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(updateBehandling(behandlingIdentifier))
      .then(() => {
        expect(store.getActions()).to.have.length(2);
        const [requestStartedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('/fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql({ behandlingId: '456', saksnummer: '123' });
        expect(requestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(requestFinishedAction.type).to.contain('/fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql({ id: 456, osv: 'osv' });
      });
  });

  it('skal hente behandling med original behandling', () => {
    const revurderingBehandling = {
      id: 456,
      osv: 'osv',
      originalBehandlingId: 23,
    };
    const forstegangsbehandling = {
      id: 23,
      osv: 'orig behandling',
    };
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.BEHANDLING))
      .replyOnce(200, revurderingBehandling);
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.BEHANDLING))
      .replyOnce(200, forstegangsbehandling);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier(1, 456);

    return store.dispatch(updateBehandling(behandlingIdentifier))
      .then(() => {
        expect(store.getActions()).to.have.length(4);
        const [requestStartedAction, requestFinishedAction, origBehandlingrequestStartedAction, origBehandlingrequestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('/fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql({ behandlingId: 456, saksnummer: '1' });
        expect(requestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(requestFinishedAction.type).to.contain('/fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql(revurderingBehandling);

        expect(origBehandlingrequestStartedAction.type).to.contain('/fpsak/api/behandlinger STARTED');
        expect(origBehandlingrequestStartedAction.payload.params).is.eql({ behandlingId: 23, saksnummer: '1' });
        expect(origBehandlingrequestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(origBehandlingrequestFinishedAction.type).to.contain('/fpsak/api/behandlinger FINISHED');
        expect(origBehandlingrequestFinishedAction.payload).is.eql(forstegangsbehandling);
      });
  });
});
