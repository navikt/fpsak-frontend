import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import { FpsakApi, getFpsakApiPath } from 'data/fpsakApi';
import SupportPanels from './supportPanels';
import {
  behandlingSupportReducer, setSelectedSupportPanel, getSelectedSupportPanel, resetBehandlingSupport, updateBehandlingsupportInfo,
}
  from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Behandlingsupport-reducer', () => {
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

  it('skal markere i state at godkjenningsfanen er valgt', () => {
    const store = mockStore();

    store.dispatch(setSelectedSupportPanel(SupportPanels.APPROVAL));

    expect(store.getActions()).to.have.length(1);

    expect(behandlingSupportReducer(undefined, store.getActions()[0])).to.eql({
      selectedSupportPanel: SupportPanels.APPROVAL,
    });
  });

  it('skal hente dokumenter og historie fra server', () => {
    const documents = [];
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ALL_DOCUMENTS))
      .reply(200, documents);
    const history = {};
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.HISTORY))
      .reply(200, history);

    const store = mockStore();

    const saksnummer = '1234';
    return store.dispatch(updateBehandlingsupportInfo(saksnummer))
      .then(() => {
        expect(store.getActions()).to.have.length(4);
        const [requestDocumentStarted, requestHistoryStarted, requestDocumentFinished, requestHistoryFinished] = store.getActions();

        expect(requestDocumentStarted.type).to.contain('/fpsak/api/dokument/hent-dokumentliste STARTED');
        expect(requestDocumentStarted.payload.params).is.eql({ saksnummer });
        expect(requestDocumentStarted.meta).is.eql({ options: { keepData: true } });

        expect(requestDocumentFinished.type).to.contain('/fpsak/api/dokument/hent-dokumentliste FINISHED');
        expect(requestDocumentFinished.payload).is.eql([]);
        expect(requestDocumentFinished.meta).is.undefined;

        expect(requestHistoryStarted.type).to.contain('/fpsak/api/historikk STARTED');
        expect(requestHistoryStarted.payload.params).is.eql({ saksnummer });
        expect(requestHistoryStarted.meta).is.eql({ options: { keepData: true } });

        expect(requestHistoryFinished.type).to.contain('/fpsak/api/historikk FINISHED');
        expect(requestHistoryFinished.payload).is.eql({});
        expect(requestHistoryFinished.meta).is.undefined;
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
        behandlingSupportContext: {
          selectedSupportPanel: SupportPanels.APPROVAL,
        },
      },
    };
    expect(getSelectedSupportPanel(state)).is.eql(SupportPanels.APPROVAL);
  });
});
