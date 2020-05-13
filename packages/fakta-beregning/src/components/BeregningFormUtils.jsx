import { createSelector } from 'reselect';
import { isBehandlingFormDirty, getBehandlingFormInitialValues, getBehandlingFormValues } from '@fpsak-frontend/form';

export const formNameAvklarAktiviteter = 'avklarAktiviteterForm';

export const formNameVurderFaktaBeregning = 'vurderFaktaBeregningForm';

export const MANUELL_OVERSTYRING_BEREGNINGSGRUNNLAG_FIELD = 'manuellOverstyringRapportertInntekt';

export const getFormValuesForAvklarAktiviteter = createSelector([
  (state, ownProps) => getBehandlingFormValues(formNameAvklarAktiviteter, ownProps.behandlingId, ownProps.behandlingVersjon)(state)],
(values) => values);

export const getFormInitialValuesForAvklarAktiviteter = createSelector([
  (state, ownProps) => getBehandlingFormInitialValues(formNameAvklarAktiviteter, ownProps.behandlingId, ownProps.behandlingVersjon)(state)],
(values) => values);

export const getFormValuesForBeregning = createSelector([
  (state, ownProps) => getBehandlingFormValues(formNameVurderFaktaBeregning, ownProps.behandlingId, ownProps.behandlingVersjon)(state)],
(values) => values);

export const getFormInitialValuesForBeregning = createSelector([
  (state, ownProps) => getBehandlingFormInitialValues(formNameVurderFaktaBeregning, ownProps.behandlingId, ownProps.behandlingVersjon)(state)],
(values) => values);

export const isBeregningFormDirty = createSelector([
  (state, ownProps) => isBehandlingFormDirty(formNameVurderFaktaBeregning, ownProps.behandlingId, ownProps.behandlingVersjon)(state)],
(values) => values);
