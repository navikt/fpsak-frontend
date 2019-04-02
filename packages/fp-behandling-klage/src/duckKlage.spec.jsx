import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import klageBehandlingApi, { reduxRestApi } from './data/klageBehandlingApi';
import {
  fpsakBehandlingReducer, setBehandlingInfo, setHasShownBehandlingPaVent, updateBehandling, getBehandlingIdentifier,
} from './duckKlage';

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
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      avsluttedeBehandlinger: [],
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
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      avsluttedeBehandlinger: [],
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
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      avsluttedeBehandlinger: [],
    });
  });

  it('skal hente behandling', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPost(klageBehandlingApi.BEHANDLING.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, { id: 456, osv: 'osv' });

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');
    return store.dispatch(updateBehandling(behandlingIdentifier))
      .then(() => {
        expect(store.getActions()).to.have.length(5);
        const [requestStartedAction, requestStatusStartedAction, requestStatusFinishedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql({ behandlingId: '456', saksnummer: '123' });
        expect(requestStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(requestStatusStartedAction.type).to.contain('fpsak/api/behandlinger STATUS_STARTED');
        expect(requestStatusFinishedAction.type).to.contain('fpsak/api/behandlinger STATUS_FINISHED');

        expect(requestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql({ id: 456, osv: 'osv' });
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
