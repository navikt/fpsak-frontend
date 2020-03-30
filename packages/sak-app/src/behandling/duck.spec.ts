import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { reduxRestApi } from '../data/fpsakApi';
import {
  behandlingReducer, setUrlBehandlingId,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandling-reducer', () => {
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
    expect(behandlingReducer(undefined, { type: '' })).to.eql({
      behandlingId: undefined,
      behandlingVersjon: undefined,
      urlBehandlingId: undefined,
    });
  });

  it('skal markere i state at behandling er valgt', () => {
    const store = mockStore();

    store.dispatch(setUrlBehandlingId(1));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingReducer(undefined, store.getActions()[0])).to.eql({
      urlBehandlingId: 1,
      behandlingId: undefined,
      behandlingVersjon: undefined,
    });
  });
});
