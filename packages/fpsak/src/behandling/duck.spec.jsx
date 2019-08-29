import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { ApiStateBuilder } from '@fpsak-frontend/utils-test/src/data-test-helper';

import fpsakApi, { reduxRestApi } from 'data/fpsakApi';
import {
  getRettigheter, behandlingReducer, setSelectedBehandlingId,
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

    const dataState = new ApiStateBuilder()
      .withData(fpsakApi.NAV_ANSATT.name, navAnsatt)
      .withData(fpsakApi.FETCH_FAGSAK.name, {})
      .withData('BEHANDLING', {
        id: 1000051,
        'original-behandling': {
          id: 1000050,
          versjon: 1,
        },
      }, 'dataContextFpsakBehandling')
      .build();


    const state = {
      default: {
        ...dataState.default,
        fagsak: {
          selectedSaksnummer: 1,
        },
        fpsakBehandling: {
          behandlingId: 1,
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
