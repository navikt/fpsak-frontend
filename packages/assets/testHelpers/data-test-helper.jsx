import RestDuck from '@fpsak-frontend/fpsak/src/data/rest/redux/RestDuck';
import getAxiosHttpClientApi from '@fpsak-frontend/fpsak/src/data/rest/axios/axiosHttpClientApi';
import RequestApi from '@fpsak-frontend/fpsak/src/data/rest/requestApi/RequestApi';
import reducers from '@fpsak-frontend/fpsak/src/reducers';

export const withoutRestActions = actions => actions.filter(a => !a.type.match(/^@@REST/));

export const ignoreRestErrors = e => (e.config && e.response ? e : Promise.reject(e));

export const apiState = () => {
  const state = { default: reducers() };

  state.withData = (api, data) => {
    const configs = [{
      name: api,
    }];
    const requestApi = new RequestApi(getAxiosHttpClientApi(), 'fpsak', configs);
    const d = new RestDuck(requestApi.getRequestRunner(api));
    state.default.dataContext[api] = d.reducer(d.reducer(), d.actionCreators.requestFinished(data));
    return state;
  };

  return state;
};

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
