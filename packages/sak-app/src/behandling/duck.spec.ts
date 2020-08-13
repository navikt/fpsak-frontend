import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import {
  behandlingReducer, setUrlBehandlingId,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandling-reducer', () => {
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
