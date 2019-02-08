import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { withoutRestActions } from '@fpsak-frontend/assets/testHelpers//data-test-helper';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import klageBehandlingApi, { reduxRestApi } from '../data/klageBehandlingApi';

import {
  setOpenInfoPanels, faktaReducer, resolveFaktaAksjonspunkter, RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED, RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS,
}
  from './duckFaktaKlage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

  it('skal sette åpne infopanel', () => {
    const medlempanel = 'medlempanel';
    const adopsjonpanel = 'adopsjon';

    const action1 = setOpenInfoPanels([medlempanel]);
    const result1 = faktaReducer(undefined, action1);
    expect(result1).to.eql({
      openInfoPanels: [medlempanel],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });

    const action2 = setOpenInfoPanels([medlempanel, adopsjonpanel]);
    const result2 = faktaReducer(result1, action2);
    expect(result2).to.eql({
      openInfoPanels: [medlempanel, adopsjonpanel],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal returnere initial state', () => {
    expect(faktaReducer(undefined, {})).to.eql({
      openInfoPanels: [],
      resolveFaktaAksjonspunkterStarted: false,
      resolveFaktaAksjonspunkterSuccess: false,
    });
  });

  it('skal avklare aksjonspunkter', () => {
    mockAxios
      .onPost(klageBehandlingApi.SAVE_AKSJONSPUNKT.path)
      .reply(200, [{ vurdering: 'test' }]);

    const store = mockStore();
    const behandlingIdentifier = new BehandlingIdentifier('12345', '6789');

    return store.dispatch(resolveFaktaAksjonspunkter({ vilkarKode: 'FP_VK_5' }, behandlingIdentifier))
      .catch(e => e) // Don't care if other APIs fail
      .then(() => {
        const actions = withoutRestActions(store.getActions());
        expect(actions).to.have.length(3);
        const [resolveFaktaStartedAction, pollingMessageAction, resolveFaktaSuccessAction] = actions;
        expect(resolveFaktaStartedAction).to.have.property('type', RESOLVE_FAKTA_AKSJONSPUNKTER_STARTED);
        expect(pollingMessageAction).to.have.property('type', 'pollingMessage/SET_REQUEST_POLLING_MESSAGE');
        expect(resolveFaktaSuccessAction).to.have.property('type', RESOLVE_FAKTA_AKSJONSPUNKTER_SUCCESS);

        const stateAfterFetchStarted = faktaReducer(undefined, resolveFaktaStartedAction);
        expect(stateAfterFetchStarted).to.eql({
          openInfoPanels: [],
          resolveFaktaAksjonspunkterStarted: true,
          resolveFaktaAksjonspunkterSuccess: false,
        });

        const stateAfterFetchFinished = faktaReducer(undefined, resolveFaktaSuccessAction);
        expect(stateAfterFetchFinished).to.eql({
          openInfoPanels: [],
          resolveFaktaAksjonspunkterStarted: false,
          resolveFaktaAksjonspunkterSuccess: true,
        });
      });
  });
});
