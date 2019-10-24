import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';

import fpsakApi, { reduxRestApi } from '../data/fpsakApi';
import behandlingOrchestrator from './BehandlingOrchestrator';
import ApplicationContextPath from './ApplicationContextPath';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BehandlingOrchestrator', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  beforeEach(() => {
    behandlingOrchestrator.reset();
  });

  afterEach(() => {
    mockAxios.reset();
  });


  after(() => {
    mockAxios.restore();
    behandlingOrchestrator.reset();
  });

  it('skal ikke hente behandlinger, dokumenter og historikk for tilbakekreving når dette er slått av', async () => {
    behandlingOrchestrator.disableTilbakekreving();

    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, [{ id: 1 }]);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS.path)
      .replyOnce(200, [{ dokId: 1 }]);
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, [{ histId: 1 }]);
    const store = mockStore();

    expect(behandlingOrchestrator.disabledContextPaths).to.eql([ApplicationContextPath.FPTILBAKE]);
    expect(behandlingOrchestrator.notAvailableContextPaths).to.have.length(0);

    const resultBehandlinger = await behandlingOrchestrator.fetchBehandlinger('1', store.dispatch);
    const resultDocAndHist = await behandlingOrchestrator.fetchBehandlingSupportInfo('1', store.dispatch);

    expect(resultBehandlinger).to.eql({
      payload: [{ id: 1 }],
    });
    expect(resultDocAndHist).to.eql([{
      payload: [{ dokId: 1 }],
    }, {
      payload: [{ histId: 1 }],
    }]);
  });

  it('skal disable tilbakekreving når en ikke kan hente tilbakekrevingsbehandlinger', async () => {
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, [{ id: 1 }]);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS.path)
      .replyOnce(200, [{ dokId: 1 }]);
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, [{ histId: 1 }]);
    const store = mockStore();

    const result = await behandlingOrchestrator.fetchBehandlinger('1', store.dispatch);
    const resultDocAndHist = await behandlingOrchestrator.fetchBehandlingSupportInfo('1', store.dispatch);

    expect(behandlingOrchestrator.disabledContextPaths).to.have.length(0);
    expect(behandlingOrchestrator.notAvailableContextPaths).to.eql([ApplicationContextPath.FPTILBAKE]);

    expect(result).to.eql({
      payload: [{ id: 1 }],
    });
    expect(resultDocAndHist).to.eql([{
      payload: [{ dokId: 1 }],
    }, {
      payload: [{ histId: 1 }],
    }]);
  });


  it('skal hent data for tilbakekreving', async () => {
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, [{ id: 1 }]);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS.path)
      .replyOnce(200, [{ dokId: 1 }]);
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, [{ histId: 1 }]);
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPTILBAKE.path)
      .replyOnce(200, [{ id: 2 }]);
    mockAxios
      .onGet(fpsakApi.HISTORY_FPTILBAKE.path)
      .replyOnce(200, [{ histId: 2 }]);
    const store = mockStore();

    const result = await behandlingOrchestrator.fetchBehandlinger('1', store.dispatch);
    const resultDocAndHist = await behandlingOrchestrator.fetchBehandlingSupportInfo('1', store.dispatch);

    expect(behandlingOrchestrator.notAvailableContextPaths).to.have.length(0);
    expect(behandlingOrchestrator.disabledContextPaths).to.have.length(0);

    expect(result).to.eql({
      payload: [{ id: 1 }, { id: 2 }],
    });
    expect(resultDocAndHist).to.eql([{
      payload: [{ dokId: 1 }],
    }, {
      payload: [{ histId: 1 }],
    }, {
      payload: [{ histId: 2 }],
    }]);
  });
});
