import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { withoutRestActions, ignoreRestErrors } from 'testHelpers/data-test-helper';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { FpsakApi, getFpsakApiPath } from 'data/fpsakApi';
import {
  behandlingsprosessReducer, resetBehandlingspunkter, setSelectedBehandlingspunktNavn,
  resolveProsessAksjonspunkter, overrideProsessAksjonspunkter,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsprosess-reducer', () => {
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
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.SAVE_AKSJONSPUNKT))
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(resolveProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(2);

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[1]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });

  it('skal overstyre aksjonspunkter', () => {
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.SAVE_OVERSTYRT_AKSJONSPUNKT))
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(overrideProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(2);

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[1]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });

  it('skal overstyre aksjonspunkter', () => {
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.SAVE_OVERSTYRT_AKSJONSPUNKT))
      .reply(200, [{ personstatus: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('123', '456');

    return store.dispatch(overrideProsessAksjonspunkter(behandlingIdentifier, [{ id: 1 }], false))
      .catch(ignoreRestErrors)
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(2);

        const stateAfterFetchStarted = behandlingsprosessReducer(undefined, actions[0]);
        expect(stateAfterFetchStarted).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: true,
          resolveProsessAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = behandlingsprosessReducer(undefined, actions[1]);
        expect(stateAfterFetchFinished).to.eql({
          overrideBehandlingspunkter: [],
          selectedBehandlingspunktNavn: undefined,
          resolveProsessAksjonspunkterStarted: false,
          resolveProsessAksjonspunkterSuccess: true,
        });
      });
  });
});
