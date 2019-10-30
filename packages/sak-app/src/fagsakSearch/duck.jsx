import fpsakApi from '../data/fpsakApi';

/* Action creators */
export const searchFagsaker = fpsakApi.SEARCH_FAGSAK.makeRestApiRequest();

export const resetFagsakSearch = () => (dispatch) => {
  dispatch(fpsakApi.SEARCH_FAGSAK.resetRestApi());
};
