import axios from 'axios';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ErrorTypes } from 'app/ErrorTypes';
import asyncPollingStatus from './redux/asyncPollingStatus';
import configureRestInterceptors from './restConfig';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<restConfig>', () => {
  afterEach(() => {
    axios.interceptors.response.handlers = [];
  });

  it('skal initialisere axios handlers', () => {
    expect(axios.interceptors.response.handlers).has.length(0);

    configureRestInterceptors(mockStore());

    expect(axios.interceptors.response.handlers).has.length(1);
    const { handlers } = axios.interceptors.response;
    expect(handlers[0].fulfilled).to.not.be.undefined;
    expect(handlers[0].rejected).to.not.be.undefined;
  });

  it('skal håndtere suksess-svar som inneholder status HALTED', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const response = {
      data: {
        taskStatus: {
          message: {
            feilmelding: 'test',
          },
          status: asyncPollingStatus.HALTED,
          eta: '2017-08-02T00:54:25.455',
        },
      },
    };

    const { handlers } = axios.interceptors.response;
    handlers[0].fulfilled(response);

    const actions = store.getActions();
    expect(actions).to.have.length(1);
    expect(actions[0].type).to.eql('ADD_ERROR_MESSAGE_CODE');
    expect(actions[0].data).to.eql({ code: 'Rest.ErrorMessage.General', params: { errorDetails: { feilmelding: 'test' } } });
  });

  it('skal håndtere suksess-svar som inneholder status DELAYED', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const response = {
      data: {
        taskStatus: {
          message: 'Delayed-melding',
          status: asyncPollingStatus.DELAYED,
          eta: '2017-08-02T00:54:25.455',
        },
      },
    };

    const { handlers } = axios.interceptors.response;
    handlers[0].fulfilled(response);

    const actions = store.getActions();
    expect(actions).to.have.length(1);
    expect(actions[0].type).to.eql('ADD_ERROR_MESSAGE_CODE');
    expect(actions[0].data).to.eql({
      code: 'Rest.ErrorMessage.DownTime',
      params: {
        message: 'Delayed-melding',
        date: '02.08.2017',
        time: '00:54',
      },
    });
  });

  it('skal håndtere error-svar som inneholder status DELAYED', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const error = {
      response: {
        data: {
          message: 'Delayed-melding',
          status: asyncPollingStatus.DELAYED,
          eta: '2017-08-02T00:54:25.455',
        },
        status: 418,
      },
    };

    const { handlers } = axios.interceptors.response;

    return handlers[0].rejected(error)
      .catch(() => {
        const actions = store.getActions();
        expect(actions).to.have.length(1);
        expect(actions[0].type).to.eql('ADD_ERROR_MESSAGE_CODE');
        expect(actions[0].data).to.eql({
          code: 'Rest.ErrorMessage.DownTime',
          params: {
            message: 'Delayed-melding',
            date: '02.08.2017',
            time: '00:54',
          },
        });
      });
  });

  it('skal håndtere tilfeller der error-response kun inneholder en melding', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const error = {
      message: 'Dette er en feil',
    };

    const { handlers } = axios.interceptors.response;

    return handlers[0].rejected(error)
      .catch(() => {
        const actions = store.getActions();
        expect(actions).to.have.length(1);
        expect(actions[0].type).to.eql('ADD_ERROR_MESSAGE');
        expect(actions[0].data).to.eql({
          message: 'Dette er en feil',
        });
      });
  });

  it('skal legge til feilmelding når feil ikke er markert som håndtert', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const error = {
      response: {
        data: {
          type: 'test',
        },
      },
    };

    const { handlers } = axios.interceptors.response;

    return handlers[0].rejected(error)
      .catch(() => {
        const actions = store.getActions();
        expect(actions).to.have.length(1);
        expect(actions[0].type).to.eql('ADD_ERROR_MESSAGE');
        expect(actions[0].data).to.eql({
          type: 'test',
        });
      });
  });

  it('skal ikke legge til feilmelding når feil er markert som håndtert', () => {
    const store = mockStore();
    configureRestInterceptors(store);

    const error = {
      response: {
        data: {
          type: ErrorTypes.MANGLER_TILGANG_FEIL,
        },
      },
    };

    const { handlers } = axios.interceptors.response;

    return handlers[0].rejected(error)
      .catch(() => {
        const actions = store.getActions();
        expect(actions).to.have.length(0);
      });
  });
});
