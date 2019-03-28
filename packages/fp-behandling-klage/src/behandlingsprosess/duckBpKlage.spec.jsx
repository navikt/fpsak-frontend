import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { withoutRestActions, ignoreRestErrors } from '@fpsak-frontend/utils-test/src/data-test-helper';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import klageBehandlingApi, { reduxRestApi } from '../data/klageBehandlingApi';
import {
  behandlingsprosessReducer, resetBehandlingspunkter, setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter, overrideProsessAksjonspunkter,
} from './duckBpKlage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsprosess-reducer', () => {
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
    expect(behandlingsprosessReducer(undefined, {})).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: undefined,
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal resette behandlingspunkter til opprinnelig state, men ikke selectedBehandlingspunktNavn', () => {
    const manipulertState = {
      overrideBehandlingspunkter: [{ test: 'test' }],
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: true,
      resolveProsessAksjonspunkterSuccess: true,
    };

    expect(behandlingsprosessReducer(manipulertState, resetBehandlingspunkter())).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: 'askjlhd',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal sette valgt behandlingspunkt-navn', () => {
    const behandlingspunkt = setSelectedBehandlingspunktNavn('test');

    expect(behandlingsprosessReducer(undefined, behandlingspunkt)).to.eql({
      overrideBehandlingspunkter: [],
      selectedBehandlingspunktNavn: 'test',
      resolveProsessAksjonspunkterStarted: false,
      resolveProsessAksjonspunkterSuccess: false,
    });
  });

  it('skal avklare aksjonspunkter', () => {
    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPost(klageBehandlingApi.SAVE_AKSJONSPUNKT.path)
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

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[2]);
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
      .onPost(klageBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.path)
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

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[2]);
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
      .onPost(klageBehandlingApi.SAVE_OVERSTYRT_AKSJONSPUNKT.path)
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

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[2]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });
});
