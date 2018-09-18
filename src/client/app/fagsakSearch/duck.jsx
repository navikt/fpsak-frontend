import { makeRestApiRequest, resetRestApi } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

/* Action creators */
export const searchFagsaker = makeRestApiRequest(FpsakApi.SEARCH_FAGSAK);

export const resetFagsakSearch = () => (dispatch) => {
  dispatch(resetRestApi(FpsakApi.SEARCH_FAGSAK));
};
