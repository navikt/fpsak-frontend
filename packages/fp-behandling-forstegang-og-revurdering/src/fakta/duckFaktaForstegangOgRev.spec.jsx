import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { getFaktaRedux } from '@fpsak-frontend/fp-behandling-felles';
import { withoutRestActions } from '@fpsak-frontend/utils-test/src/data-test-helper';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import fpsakBehandlingApi, { reduxRestApi } from '../data/fpsakBehandlingApi';
import { resolveFaktaAksjonspunkter } from './duckFaktaForstegangOgRev';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const faktaRedux = getFaktaRedux('forstegangOgRevurderingFakta');

describe('Fakta-reducer', () => {
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
      .reply(200, [{ vurdering: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('12345', '6789');

    return store.dispatch(resolveFaktaAksjonspunkter({ vilkarKode: 'FP_VK_5' }, behandlingIdentifier))
      .catch((e) => e) // Don't care if other APIs fail
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);
        const [resolveFaktaStartedAction, pollingMessageAction, resolveFaktaSuccessAction] = actions;
        expect(resolveFaktaStartedAction).to.have.property('type', faktaRedux.actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED);
        expect(pollingMessageAction).to.have.property('type', 'pollingMessage/SET_REQUEST_POLLING_MESSAGE');
        expect(resolveFaktaSuccessAction).to.have.property('type', faktaRedux.actionTypes.RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS);

        const stateAfterFetchStarted = faktaRedux.reducer(undefined, resolveFaktaStartedAction);
        expect(stateAfterFetchStarted).to.eql({
          openInfoPanels: [],
          resolveFaktaAksjonspunkterStarted: true,
          resolveFaktaAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = faktaRedux.reducer(undefined, resolveFaktaSuccessAction);
        expect(stateAfterFetchFinished).to.eql({
          openInfoPanels: [],
          resolveFaktaAksjonspunkterStarted: false,
          resolveFaktaAksjonspunkterSuccess: true,
        });
      });
  });
});
