import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { ApiStateBuilder } from '@fpsak-frontend/utils-test/src/data-test-helper';

import fpsakApi, { reduxRestApi } from 'data/fpsakApi';
import {
  behandlingReducer, setSelectedBehandlingId, getRettigheter,
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
    expect(behandlingReducer(undefined, {})).to.eql({
      behandlingId: undefined,
      behandlingInfoHolder: {},
    });
  });

  it('skal markere i state at behandling er valgt', () => {
    const store = mockStore();

    store.dispatch(setSelectedBehandlingId(1));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingReducer(undefined, store.getActions()[0])).to.eql({
      behandlingId: 1,
      behandlingInfoHolder: {},
    });
  });

  it('skal hente rettigheter til NAV-ansatt fra state', () => {
    const navAnsatt = { navn: 'Ann S. Att', kanSaksbehandle: true };
    const params = { saksnummer: 1 };

    const dataState = new ApiStateBuilder()
      .withData(fpsakApi.NAV_ANSATT.name, params, navAnsatt)
      .withData(fpsakApi.FETCH_FAGSAK.name, params, {})
      .withData(fpsakApi.BEHANDLINGER_FPSAK.name, params, [{
        id: 1000051,
        versjon: 1,
      }])
      .withData(fpsakApi.BEHANDLINGER_FPTILBAKE.name, params, [])
      .build();


    const state = {
      default: {
        ...dataState.default,
        fagsak: {
          selectedSaksnummer: 1,
        },
        fpsakBehandling: {
          behandlingId: 1000051,
        },
        behandling: {
          behandlingInfoHolder: {},
        },
      },
    };
    const rettigheter = getRettigheter(state);

    expect(Object.keys(rettigheter)).to.have.lengthOf.above(0);
    Object.keys(rettigheter)
      .forEach((key) => expect(rettigheter).to.have.property(key)
        .that.has.all.keys('employeeHasAccess', 'isEnabled'));
  });
});
