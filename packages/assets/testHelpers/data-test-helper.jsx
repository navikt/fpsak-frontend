import RestDuck from 'data/rest/RestDuck';
import reducers from '../app/reducers';
import behandlingStatus from 'kodeverk/behandlingStatus';
import behandlingType from 'kodeverk/behandlingType';

export const withoutRestActions = actions => actions.filter(a => !a.type.match(/^@@REST/));

export const ignoreRestErrors = e => (e.config && e.response ? e : Promise.reject(e));

export const apiState = () => {
  const state = { default: reducers() };

  state.withData = (api, data) => {
    const d = new RestDuck(api);
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
