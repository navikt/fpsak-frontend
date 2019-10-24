import fpsakApi from '../../data/fpsakApi';

export const approve = (params) => (dispatch) => (dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.makeRestApiRequest()(params)));
export const resetApproval = () => (dispatch) => (dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.resetRestApi()));

/* Selectors */
export const getApproveFinished = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished();
