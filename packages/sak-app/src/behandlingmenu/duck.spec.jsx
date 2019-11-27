import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import fpsakApi, { reduxRestApi } from '../data/fpsakApi';
import behandlingUpdater from '../behandling/BehandlingUpdater';
import {
  behandlingMenuReducer, createNewBehandling, openBehandlingForChanges, resetBehandlingMenuData, setHasSubmittedPaVentForm,
} from './duck';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('BehandlingMenu-reducer', () => {
  let mockAxios;

  before(() => {
    mockAxios = new MockAdapter(reduxRestApi.getHttpClientApi().axiosInstance);
  });

  afterEach(() => {
    mockAxios.reset();
    behandlingUpdater.reset();
  });

  after(() => {
    mockAxios.restore();
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

    const data = {
      resource: 'resource',
    };
    const headers = {
      location: 'status-url',
    };
    mockAxios
      .onPut(fpsakApi.NEW_BEHANDLING_FPSAK.path)
      .reply(202, data, headers);
    mockAxios
      .onGet(headers.location)
      .reply(200, fagsak);
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);


    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };
    const isTilbakekreving = false;

    return store.dispatch(createNewBehandling(push, fagsak.saksnummer, true, isTilbakekreving, params))
      .then(() => {
        expect(store.getActions()).to.have.length(7);
        const [requestStartedAction, requestStatusStartedAction, requestStatusFinishedAction, requestFinishedAction] = store.getActions();

        expect(requestStartedAction.type).to.contain('fpsak/api/behandlinger STARTED');
        expect(requestStartedAction.payload.params).is.eql(params);
        expect(requestStartedAction.meta).is.eql({ options: {} });

        expect(requestStatusStartedAction.type).to.contain('fpsak/api/behandlinger STATUS_STARTED');
        expect(requestStatusFinishedAction.type).to.contain('fpsak/api/behandlinger STATUS_FINISHED');

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

  it('skal ved opprettelse av ny behandling returnere behandling og så velge denne', () => {
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
      .onPut(fpsakApi.NEW_BEHANDLING_FPSAK.path)
      .reply(200, behandling);
    mockAxios
      .onGet(fpsakApi.BEHANDLINGER_FPSAK.path)
      .replyOnce(200, behandlinger);

    const store = mockStore();

    const push = sinon.spy();
    const params = { behandlingType: 'revurdering' };
    const isTilbakekreving = false;

    return store.dispatch(createNewBehandling(push, 1, true, isTilbakekreving, params))
      .then(() => {
        expect(store.getActions()).to.have.length(4);
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

  it('skal åpne behandling for endringer', () => {
    const updater = {
      setBehandlingResult: () => () => () => Promise.resolve(sinon.spy()),
    };
    behandlingUpdater.setUpdater(updater);

    reduxRestApi.injectPaths([{
      href: '/fpsak/api/behandlinger/opne-for-endringer',
      rel: 'opne-for-endringer',
      requestPayload: { behandlingId: null, behandlingVersjon: null },
      type: 'POST',
    }]);

    mockAxios
      .onPost(fpsakApi.OPEN_BEHANDLING_FOR_CHANGES.path)
      .replyOnce(200);

    const store = mockStore();

    const params = { behandlingId: 2, behandlingVersjon: 10 };
    const id = new BehandlingIdentifier(1, 2);

    return store.dispatch(openBehandlingForChanges(params, id))
      .then(() => {
        expect(store.getActions()).to.have.length(2);
        const [startOpenForChanges] = store.getActions();
        expect(startOpenForChanges.type).to.contain('@@REST/OPEN_BEHANDLING_FOR_CHANGES');
        expect(startOpenForChanges.payload.params).is.eql({
          behandlingId: 2,
          behandlingVersjon: 10,
        });
      });
  });
});
