import { createSelector } from 'reselect';

const getFormState = (state) => state.form;
const getRegisteredFields = (formName) => createSelector(
  [getFormState],
  (formState = {}) => (formState[formName] ? formState[formName].registeredFields : {}),
);

export default getRegisteredFields;
