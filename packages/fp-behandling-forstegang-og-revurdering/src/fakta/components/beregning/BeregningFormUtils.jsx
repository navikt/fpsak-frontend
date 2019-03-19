import { createSelector } from 'reselect';
import { getBehandlingFormValues, getBehandlingFormInitialValues, isBehandlingFormDirty } from 'behandlingForstegangOgRevurdering/src/behandlingForm';

export const formName = 'faktaOmBeregningForm';

export const getFormValuesForBeregning = createSelector([
  getBehandlingFormValues(formName)], values => values);

export const getFormInitialValuesForBeregning = createSelector([
  getBehandlingFormInitialValues(formName)], values => values);

export const isBeregningFormDirty = state => isBehandlingFormDirty(formName)(state);
