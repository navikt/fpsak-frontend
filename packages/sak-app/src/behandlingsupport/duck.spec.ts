import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { supportTabs } from '@fpsak-frontend/sak-support-meny';

import { reduxRestApi } from '../data/fpsakApi';
import {
  behandlingSupportReducer, getSelectedSupportPanel, resetBehandlingSupport, setSelectedSupportPanel,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsupport-reducer', () => {
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

  it('skal markere i state at godkjenningsfanen er valgt', () => {
    const store = mockStore();

    store.dispatch(setSelectedSupportPanel(supportTabs.APPROVAL));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingSupportReducer(undefined, store.getActions()[0])).to.eql({
      selectedSupportPanel: supportTabs.APPROVAL,
    });
  });

  it('skal markere i state at godkjenningsfanen ikke lenger er valgt', () => {
    const store = mockStore();

    store.dispatch(resetBehandlingSupport());

    expect(store.getActions()).to.have.length(1);

    expect(behandlingSupportReducer(undefined, store.getActions()[0])).to.eql({
      selectedSupportPanel: undefined,
    });
  });

  it('skal hente valgt panel', () => {
    const state = {
      default: {
        behandlingSupport: {
          selectedSupportPanel: supportTabs.APPROVAL,
        },
      },
    };
    expect(getSelectedSupportPanel(state)).is.eql(supportTabs.APPROVAL);
  });
});
