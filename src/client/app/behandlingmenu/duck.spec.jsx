import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { FpsakApi, getFpsakApiPath } from 'data/fpsakApi';
import {
  behandlingMenuReducer, setHasSubmittedPaVentForm, createNewForstegangsbehandling, openBehandlingForChanges,
  resetBehandlingMenuData,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BehandlingMenu-reducer', () => {
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
    mockAxios
      .onPut(getFpsakApiPath(FpsakApi.NEW_BEHANDLING))
      .reply(200, fagsak);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ALL_DOCUMENTS))
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.HISTORY))
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.BEHANDLINGER))
      .replyOnce(200, behandlinger);

    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };

    return store.dispatch(createNewForstegangsbehandling(push, fagsak.saksnummer, params))
      .then(() => {
        expect(store.getActions()).to.have.length(12);
        const [behandlingReset, originalBehandlingReset, requestStartedAction, requestFinishedAction] = store.getActions();

        expect(behandlingReset.type).to.contain('/behandling RESET');
        expect(originalBehandlingReset.type).to.contain('/originalBehandling RESET');

        expect(requestStartedAction.type).to.contain('/fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql(params);
        expect(requestStartedAction.meta).is.eql({ options: {} });

        expect(requestFinishedAction.type).to.contain('/fpsak/api/behandlinger FINISHED');
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

  it('skal ved opprettelse av ny behandling returnere behandling og så velge denne', () => {
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
    mockAxios
      .onPut(getFpsakApiPath(FpsakApi.NEW_BEHANDLING))
      .reply(200, behandling);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.FETCH_FAGSAK))
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ALL_DOCUMENTS))
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.HISTORY))
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.BEHANDLINGER))
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ANNEN_PART_BEHANDLING))
      .replyOnce(200, { url: '' });

    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };

    return store.dispatch(createNewForstegangsbehandling(push, 1, params))
      .then(() => {
        expect(store.getActions()).to.have.length(16);
        const [behandlingReset, originalBehandlingReset, requestStartedAction, requestFinishedAction] = store.getActions();

        expect(behandlingReset.type).to.contain('/behandling RESET');
        expect(originalBehandlingReset.type).to.contain('/originalBehandling RESET');

        expect(requestStartedAction.type).to.contain('/fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql(params);
        expect(requestStartedAction.meta).is.eql({ options: {} });

        expect(requestFinishedAction.type).to.contain('/fpsak/api/behandlinger FINISHED');
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

  it('skal ved opprettelse av ny behandling returnere behandling og så velge denne', () => {
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
    mockAxios
      .onPost(getFpsakApiPath(FpsakApi.OPEN_BEHANDLING_FOR_CHANGES))
      .reply(200, behandling);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.FETCH_FAGSAK))
      .replyOnce(200, fagsak);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ALL_DOCUMENTS))
      .replyOnce(200, { dokId: 10 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.HISTORY))
      .replyOnce(200, { histId: 1 });
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.BEHANDLINGER))
      .replyOnce(200, behandlinger);
    mockAxios
      .onGet(getFpsakApiPath(FpsakApi.ANNEN_PART_BEHANDLING))
      .replyOnce(200, { url: '' });

    const store = mockStore();

    const params = { behandlingId: 2, behandlingVersjon: 10 };
    const id = new BehandlingIdentifier(1, 2);

    return store.dispatch(openBehandlingForChanges(params, id))
      .then(() => {
        expect(store.getActions()).to.have.length(14);
        const [opneForEndringerStartedAction, opneForEndringerFinishedAction, copyStartedAction, copyFinishedAction] = store.getActions();

        expect(opneForEndringerStartedAction.type).to.contain('/fpsak/api/behandlinger/opne-for-endringer STARTED');
        expect(opneForEndringerStartedAction.payload.params).is.eql(params);
        expect(opneForEndringerFinishedAction.type).to.contain('/fpsak/api/behandlinger/opne-for-endringer FINISHED');

        expect(copyStartedAction.type).to.contain('@@REST/behandling COPY_DATA_STARTED');
        expect(copyStartedAction.payload.params).is.eql(id.toJson());
        expect(copyStartedAction.meta).is.eql({ options: { keepData: true } });

        expect(copyFinishedAction.type).to.contain('@@REST/behandling COPY_DATA_FINISHED');
        expect(copyFinishedAction.payload).is.eql(behandling);

        // Andre restkall blir ikke testet
      });
  });
});
