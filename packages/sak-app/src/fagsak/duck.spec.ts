import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';

import { FpsakApiKeys, reduxRestApi } from '../data/fpsakApi';
import {
  doNotResetWhitelist,
  fagsakReducer,
  RESET_FAGSAKER,
  resetFagsakContext,
  setSelectedSaksnummer,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Fagsak-reducer', () => {
  let mockAxios;

  before(() => {
    // @ts-ignore
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  after(() => {
    mockAxios.restore();
  });

  it('skal returnere initial state', () => {
    expect(fagsakReducer(undefined, { type: '' })).to.eql({
      selectedSaksnummer: null,
    });
  });

  it('skal sette valgt saksnummer i store', () => {
    const action = setSelectedSaksnummer(12345);

    expect(fagsakReducer(undefined, action)).to.eql({
      selectedSaksnummer: 12345,
    });
  });

  it('skal resette fagsak-context', () => {
    const store = mockStore();

    store.dispatch(resetFagsakContext());

    const allRestApisToReset = Object.values(FpsakApiKeys)
      .filter((value) => !doNotResetWhitelist.includes(value))
      .map((api) => (`@@REST/${api} RESET`));
    const types = store.getActions().map((action) => action.type);

    expect(types).to.includes(RESET_FAGSAKER);
    expect(types.filter((type) => type !== RESET_FAGSAKER)).to.include.members(allRestApisToReset);
  });
});
