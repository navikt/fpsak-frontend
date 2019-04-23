
import { Dispatch } from 'redux';

import fpLosApi from 'data/fpLosApi';
import { Fagsak } from './fagsakTsType';

/* Action creators */
export const searchFagsaker = fpLosApi.SEARCH_FAGSAK.makeRestApiRequest();

export const resetFagsakSearch = () => (dispatch: Dispatch) => {
  dispatch(fpLosApi.SEARCH_FAGSAK.resetRestApi()());
  dispatch(fpLosApi.OPPGAVER_FOR_FAGSAKER.resetRestApi()());
};

export const hentOppgaverForFagsaker = (fagsaker: Fagsak[]) => (dispatch: Dispatch) => dispatch(
  fpLosApi.OPPGAVER_FOR_FAGSAKER.makeRestApiRequest()(
    { saksnummerListe: fagsaker.map(fagsak => `${fagsak.saksnummer}`).join(',') },
  ),
);
