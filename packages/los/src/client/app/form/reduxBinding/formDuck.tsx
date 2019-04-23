import { createSelector } from 'reselect';

/* Action types */
export const ADD_FORM_VALUES = 'ADD_FORM_VALUES';

/* Action creators */
export const saveInReduxState = (data: any) => ({
  type: ADD_FORM_VALUES,
  data,
});

/* Reducers */
const initialState = {
  forms: {},
};

interface ActionTsType {
  type: string;
  data?: {
    key: string;
    values: any;
  };
}
interface StateTsType {
  forms: any;
}

export const formReducer = (state: StateTsType = initialState, action: ActionTsType = { type: '' }) => {
  switch (action.type) {
    case ADD_FORM_VALUES:
      return {
        forms: {
          ...state.forms,
          [action.data.key]: action.data.values,
        },
      };
    default:
      return state;
  }
};


/* Selectors */
const getFormContext = state => state.default.formContext;

export const getValuesFromReduxState = createSelector([getFormContext], formContext => formContext.forms);
