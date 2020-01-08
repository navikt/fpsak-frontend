import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { reduxRestApi } from '../data/fpsakApi';
import SupportPanels from './supportPanels';
import {
  behandlingSupportReducer, getSelectedSupportPanel, resetBehandlingSupport, setSelectedSupportPanel,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsupport-reducer', () => {
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

  it('skal markere i state at godkjenningsfanen er valgt', () => {
    const store = mockStore();

    store.dispatch(setSelectedSupportPanel(SupportPanels.APPROVAL));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingSupportReducer(undefined, store.getActions()[0])).to.eql({
      selectedSupportPanel: SupportPanels.APPROVAL,
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
          selectedSupportPanel: SupportPanels.APPROVAL,
        },
      },
    };
    expect(getSelectedSupportPanel(state)).is.eql(SupportPanels.APPROVAL);
  });
});
