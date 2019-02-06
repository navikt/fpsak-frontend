import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';

import behandlingOrchestrator from 'behandling/BehandlingOrchestrator';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-behandling-felles';
import fpsakApi, { reduxRestApi } from 'data/fpsakApi';
import behandlingUpdater from 'behandling/BehandlingUpdater';
import {
  behandlingMenuReducer, setHasSubmittedPaVentForm, createNewForstegangsbehandling, openBehandlingForChanges,
  resetBehandlingMenuData,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BehandlingMenu-reducer', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
    behandlingOrchestrator.disableTilbakekreving();
  });

  afterEach(() => {
    mockAxios.reset();
    behandlingUpdater.reset();
  });

  after(() => {
    mockAxios.restore();
    behandlingOrchestrator.reset();
    behandlingUpdater.reset();
  });

  it('skal returnere initial state', () => {
    expect(behandlingMenuReducer(undefined, {})).to.eql({
      hasSubmittedPaVentForm: false,
    });
  });

  it('skal markere i state at behandling er satt på vent', () => {
    const store = mockStore();

    store.dispatch(setHasSubmittedPaVentForm());

    expect(store.getActions()).to.have.length(1);

    expect(behandlingMenuReducer(undefined, store.getActions()[0])).to.eql({
      hasSubmittedPaVentForm: true,
    });
  });

  it('skal resette state for behandlingsmeny', () => {
    const state = {
      hasSubmittedPaVentForm: true,
    };
    const store = mockStore();

    store.dispatch(resetBehandlingMenuData());

    expect(store.getActions()).to.have.length(1);

    expect(behandlingMenuReducer(state, store.getActions()[0])).to.eql({
      hasSubmittedPaVentForm: false,
    });
  });

  it('skal ved opprettelse av ny behandling returnere fagsak og velge siste behandling fra behandlinglisten', () => {
    const fagsak = {
      saksnummer: 1,
    };
    const behandlinger = [{
      id: 1,
      opprettet: '2017-04-15',
    }, {
      id: 2,
      opprettet: '2017-08-15',
    }];

    const updater = {
      resetBehandling: () => () => Promise.resolve(sinon.spy()),
    };
    behandlingUpdater.setUpdater(updater);

    mockAxios
      .onPut(fpsakApi.NEW_BEHANDLING.path)
      .reply(200, fagsak);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS_FPSAK.path)
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);


    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };

    return store.dispatch(createNewForstegangsbehandling(push, fagsak.saksnummer, params))
      .then(() => {
        expect(store.getActions()).to.have.length(11);
        const [requestStartedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql(params);
        expect(requestStartedAction.meta).is.eql({ options: {} });

        expect(requestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql(fagsak);

        // Andre restkall blir ikke testet

        expect(push.called).is.true;
        expect(push.getCalls()).has.length(1);
        expect(push.getCalls()[0].args[0]).is.eql({
          pathname: '/fagsak/1/behandling/2/',
          search: '?punkt=default&fakta=default',
        });
      });
  });

  // TODO (TOR) Fiks test
  xit('skal ved opprettelse av ny behandling returnere behandling og så velge denne', () => {
    const fagsak = {
      id: 1,
    };
    const behandling = {
      id: 2,
    };
    const behandlinger = [{
      id: 1,
      opprettet: '2017-04-15',
    }, {
      id: 2,
      opprettet: '2017-08-15',
    }];

    const updater = {
      resetBehandling: () => () => Promise.resolve(sinon.spy()),
    };
    behandlingUpdater.setUpdater(updater);

    mockAxios
      .onPut(fpsakApi.NEW_BEHANDLING.path)
      .reply(200, behandling);
    mockAxios
      .onGet(fpsakApi.FETCH_FAGSAK.path)
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS_FPSAK.path)
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(fpsakApi.ANNEN_PART_BEHANDLING.path)
      .replyOnce(200, { url: '' });

    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };

    return store.dispatch(createNewForstegangsbehandling(push, 1, params))
      .then(() => {
        expect(store.getActions()).to.have.length(15);
        const [requestStartedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql(params);
        expect(requestStartedAction.meta).is.eql({ options: {} });

        expect(requestFinishedAction.type).to.contain('fpsak/api/behandlinger FINISHED');
        expect(requestFinishedAction.payload).is.eql(behandling);

        // Andre restkall blir ikke testet

        expect(push.called).is.true;
        expect(push.getCalls()).has.length(1);
        expect(push.getCalls()[0].args[0]).is.eql({
          pathname: '/fagsak/1/behandling/2/',
          search: '?punkt=default&fakta=default',
        });
      });
  });

  // TODO (TOR) Fiks test
  xit('skal ved opprettelse av ny behandling returnere behandling og så velge denne', () => {
    const fagsak = {
      id: 1,
    };
    const behandling = {
      id: 2,
    };
    const behandlinger = [{
      id: 1,
      opprettet: '2017-04-15',
    }, {
      id: 2,
      opprettet: '2017-08-15',
    }];

    const updater = {
      resetBehandling: () => () => Promise.resolve(sinon.spy()),
      openBehandlingForChanges: () => () => params => Promise.resolve({ type: 'OPEN_BEHANDLING_FOR_CHANGES', data: params }),
    };
    behandlingUpdater.setUpdater(updater);

    mockAxios
      .onGet(fpsakApi.FETCH_FAGSAK.path)
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(fpsakApi.ALL_DOCUMENTS_FPSAK.path)
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(fpsakApi.HISTORY_FPSAK.path)
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(fpsakApi.ANNEN_PART_BEHANDLING.path)
      .replyOnce(200, { url: '' });

    const store = mockStore();

    const params = { behandlingId: 2, behandlingVersjon: 10 };
    const id = new BehandlingIdentifier(1, 2);

    return store.dispatch(openBehandlingForChanges(params, id))
      .then(() => {
        expect(store.getActions()).to.have.length(12);
        const [copyStartedAction, copyFinishedAction] = store.getActions();
        expect(copyStartedAction.type).to.contain('@@REST/BEHANDLING COPY_DATA_STARTED');
        expect(copyStartedAction.payload.params).is.eql(id.toJson());
        expect(copyStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(copyFinishedAction.type).to.contain('@@REST/BEHANDLING COPY_DATA_FINISHED');
        expect(copyFinishedAction.payload).is.eql(behandling);

        // Andre restkall blir ikke testet
      });
  });
});
