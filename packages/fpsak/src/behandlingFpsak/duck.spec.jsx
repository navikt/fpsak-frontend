import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandlingFelles/BehandlingIdentifier';
import fpsakBehandlingApi, { reduxRestApi } from './data/fpsakBehandlingApi';
import {
  fpsakBehandlingReducer, setBehandlingInfo, setHasShownBehandlingPaVent, updateBehandling, getBehandlingIdentifier,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandling-reducer', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
  });

  it('skal returnere initial state', () => {
    expect(fpsakBehandlingReducer(undefined, {})).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
    });
  });

  it('skal markere i state at behandling er valgt', () => {
    const store = mockStore();
    const behandlingInfo = {
      behandlingId: 1,
      fagsakSaksnummer: 2,
    };

    store.dispatch(setBehandlingInfo(behandlingInfo));

    expect(store.getActions()).to.have.length(1);

    expect(fpsakBehandlingReducer(undefined, store.getActions()[0])).to.eql({
      behandlingId: 1,
      fagsakSaksnummer: 2,
      hasShownBehandlingPaVent: false,
    });
  });

  it('skal markere i state at en har vist at behandlingen er satt på vent', () => {
    const store = mockStore();

    store.dispatch(setHasShownBehandlingPaVent());

    expect(store.getActions()).to.have.length(1);

    expect(fpsakBehandlingReducer(undefined, store.getActions()[0])).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: true,
    });
  });

  it('skal hente behandling uten original behandling', () => {
    mockAxios
      .onPost(fpsakBehandlingApi.BEHANDLING.path)
      .reply(200, { id: 456, osv: 'osv' });

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');
    return store.dispatch(updateBehandling(behandlingIdentifier))
      .then(() => {
        expect(store.getActions()).to.have.length(3);
        const [requestStartedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql({ behandlingId: '456', saksnummer: '123' });
        expect(requestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(requestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
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
      .onPost(fpsakBehandlingApi.BEHANDLING.path)
      .replyOnce(200, revurderingBehandling);
    mockAxios
      .onPost(fpsakBehandlingApi.BEHANDLING.path)
      .replyOnce(200, forstegangsbehandling);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier(1, 456);

    return store.dispatch(updateBehandling(behandlingIdentifier))
      .then(() => {
        expect(store.getActions()).to.have.length(6);
        const [requestStartedAction, requestFinishedAction, pollingMessageAction,
          origBehandlingrequestStartedAction, origBehandlingrequestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql({ behandlingId: 456, saksnummer: '1' });
        expect(requestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(requestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql(revurderingBehandling);

        expect(pollingMessageAction.type).to.contain('pollingMessage/SET_REQUEST_POLLING_MESSAGE');
        expect(pollingMessageAction.payload).is.undefined;

        expect(origBehandlingrequestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(origBehandlingrequestStartedAction.payload.params).is.eql({ behandlingId: 23, saksnummer: '1' });
        expect(origBehandlingrequestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(origBehandlingrequestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
        expect(origBehandlingrequestFinishedAction.payload).is.eql(forstegangsbehandling);
      });
  });

  describe('getBehandlingIdentifier', () => {
    it('skal hente behandlingIdentifier når behandling er valgt', () => {
      const saksnummer = 2;
      const behandlingId = 1;

      const behandlingIdentifier = getBehandlingIdentifier.resultFunc(behandlingId, saksnummer);

      expect(behandlingIdentifier.behandlingId).is.eql(behandlingId);
      expect(behandlingIdentifier.saksnummer).is.eql(saksnummer);
    });

    it('skal ikke hente behandlingIdentifier når behandling ikke er valgt', () => {
      const saksnummer = 2;
      const behandlingId = undefined;

      const behandlingIdentifier = getBehandlingIdentifier.resultFunc(behandlingId, saksnummer);

      expect(behandlingIdentifier).is.undefined;
    });
  });
});
