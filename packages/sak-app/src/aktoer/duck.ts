import { reducerRegistry } from '@fpsak-frontend/rest-api-redux';

import fpsakApi from '../data/fpsakApi';

export const reducerName = 'aktoer';
export const SET_SELECTED_AKTOER_ID = `${reducerName}/SET_SELECTED_AKTOER_ID`;
export const AKTOER_LOADED = `${reducerName}/AKTOER_LOADED`;

export const setSelectedAktoerId = (aktoerId) => ({
  type: SET_SELECTED_AKTOER_ID,
  data: aktoerId,
});

export const setAktoerLoaded = (status) => ({
  type: AKTOER_LOADED,
  data: status,
});

const initialState = {
  selectedAktoerId: null,
  aktoerLoaded: false,
};

export const updateAktoer = (aktoerId) => (dispatch) => {
  dispatch(fpsakApi.AKTOER_INFO.makeRestApiRequest()({ aktoerId }, { keepData: true }));
};

interface Action {
  type: string;
  data?: string;
}

export const aktoerReducer = (state = initialState, action: Action = { type: '' }) => { // NOSONAR Switch brukes som standard i reducers
  switch (action.type) { // NOSONAR Switch brukes som standard i reducers
    case SET_SELECTED_AKTOER_ID:
      return {
        ...state,
        selectedAktoerId: action.data,
        aktoerLoaded: false,
      };
    case AKTOER_LOADED:
      return {
        ...state,
        aktoerLoaded: action.data,
      };
    default:
      return state;
  }
};

reducerRegistry.register(reducerName, aktoerReducer);
