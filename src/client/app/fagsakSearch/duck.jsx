import { makeRestApiRequest, resetRestApi } from '@fpsak-frontend/data/duck';
import { FpsakApi } from '@fpsak-frontend/data/fpsakApi';

/* Action creators */
export const searchFagsaker = makeRestApiRequest(FpsakApi.SEARCH_FAGSAK);

export const resetFagsakSearch = () => (dispatch) => {
  dispatch(resetRestApi(FpsakApi.SEARCH_FAGSAK));
};
