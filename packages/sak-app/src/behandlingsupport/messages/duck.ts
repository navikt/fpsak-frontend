import fpsakApi from '../../data/fpsakApi';

export const resetSubmitMessageActionCreator = () => (dispatch) => dispatch(fpsakApi.SUBMIT_MESSAGE.resetRestApi());

export const submitMessageActionCreator = (params) => (dispatch) => (dispatch(fpsakApi.SUBMIT_MESSAGE.makeRestApiRequest()(params)));
