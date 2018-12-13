import RestDuck from '@fpsak-frontend/fpsak/src/data/rest/redux/RestDuck';
import getAxiosHttpClientApi from '@fpsak-frontend/fpsak/src/data/rest/axios/axiosHttpClientApi';
import RequestApi from '@fpsak-frontend/fpsak/src/data/rest/requestApi/RequestApi';

export const withoutRestActions = actions => actions.filter(a => !a.type.match(/^@@REST/));

export const ignoreRestErrors = e => (e.config && e.response ? e : Promise.reject(e));

export class ApiStateBuilder {
  stateParts = {};

  withData = (api, data, dataContextName = 'dataContext') => {
    const configs = [{
      name: api,
    }];
    const requestApi = new RequestApi(getAxiosHttpClientApi(), 'fpsak', configs);
    const d = new RestDuck(requestApi.getRequestRunner(api));

    this.stateParts = {
      ...this.stateParts,
      [dataContextName]: {
        ...(this.stateParts[dataContextName] ? this.stateParts[dataContextName] : {}),
        [api]: d.reducer(d.reducer(), d.actionCreators.requestFinished(data)),
      },
    };

    return this;
  }

  build = () => {
    const state = Object.keys(this.stateParts).reduce((acc, key) => ({
      ...acc,
      [key]: this.stateParts[key],
    }), {});

    return { default: state };
  };
}

export const dummyFagsak = (saksnummer = 12345) => ({
  saksnummer,
  sakstype: { kode: 'ES', navn: 'test' },
  status: { kode: 'OPPR', navn: 'test' },
  barnFodt: '10.10.2017',
  antallBarn: 1,
  person: {
    navn: 'Espen',
    alder: 38,
    personnummer: '123456789',
    erKvinne: true,
  },
  opprettet: '10.10.2017',
  skalBehandlesAvInfotrygd: false,
});

export const dummyBehandling = (id = 67890) => ({
  id,
  versjon: 1,
  type: { kode: 'test', navn: 'test' },
  status: { kode: 'test', navn: 'test' },
  fagsakId: 0,
  opprettet: 'test',
});
