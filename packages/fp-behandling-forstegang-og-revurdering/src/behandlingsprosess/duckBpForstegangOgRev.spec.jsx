import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { withoutRestActions, ignoreRestErrors } from '@fpsak-frontend/utils-test/src/data-test-helper';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { getBehandlingsprosessRedux } from '@fpsak-frontend/fp-behandling-felles';

import fpsakBehandlingApi, { reduxRestApi } from '../data/fpsakBehandlingApi';
import { resolveProsessAksjonspunkter, overrideProsessAksjonspunkter } from './duckBpForstegangOgRev';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const behandlingsprosessRedux = getBehandlingsprosessRedux('forstegangOgRevurderingBehandlingsprosess');

describe('Behandlingsprosess-forstegang-og-revurdering-reducer', () => {
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

  it('skal avklare aksjonspunkter', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPost(fpsakBehandlingApi.SAVE_AKSJONSPUNKT.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(resolveProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);

        const stateAfterFetchStarted = behandlingsprosessRedux.reducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessRedux.reducer(undefined, actions[2]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });

  it('skal overstyre aksjonspunkter', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPost(fpsakBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(overrideProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);

        const stateAfterFetchStarted = behandlingsprosessRedux.reducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessRedux.reducer(undefined, actions[2]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });

  it('skal overstyre aksjonspunkter', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPost(fpsakBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(overrideProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);

        const stateAfterFetchStarted = behandlingsprosessRedux.reducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessRedux.reducer(undefined, actions[2]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });
});
