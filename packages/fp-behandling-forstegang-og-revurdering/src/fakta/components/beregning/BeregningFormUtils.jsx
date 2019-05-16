import { createSelector } from 'reselect';
import { getBehandlingFormValues, getBehandlingFormInitialValues, isBehandlingFormDirty } from 'behandlingForstegangOgRevurdering/src/behandlingForm';

export const formNameAvklarAktiviteter = 'avklarAktiviteterForm';

export const formNameVurderFaktaBeregning = 'vurderFaktaBeregningForm';

export const MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD = 'manuellOverstyringRapportertInntekt';

export const getFormValuesForAvklarAktiviteter = createSelector([
  getBehandlingFormValues(formNameAvklarAktiviteter)], values => values);

export const getFormInitialValuesForAvklarAktiviteter = createSelector([
  getBehandlingFormInitialValues(formNameAvklarAktiviteter)], values => values);

  export const isAvklarAktiviteterFormDirty = state => isBehandlingFormDirty(formNameAvklarAktiviteter)(state);


export const getFormValuesForBeregning = createSelector([
  getBehandlingFormValues(formNameVurderFaktaBeregning)], values => values);

export const getFormInitialValuesForBeregning = createSelector([
  getBehandlingFormInitialValues(formNameVurderFaktaBeregning)], values => values);

export const isBeregningFormDirty = state => isBehandlingFormDirty(formNameVurderFaktaBeregning)(state);
