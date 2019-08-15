import { getBehandlingForm, getBehandlingFormSelectors } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from './behandlingSelectors';
import { getSelectedBehandlingId } from './duck';

/**
 * behandlingFormForstegangOgRevurdering
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const behandlingFormForstegangOgRevurdering = (config = {}) => WrappedComponent => getBehandlingForm(
  config, WrappedComponent, getSelectedBehandlingId, getBehandlingVersjon,
);

const selectors = getBehandlingFormSelectors(getSelectedBehandlingId, getBehandlingVersjon);

export const {
  behandlingFormValueSelector,
  getBehandlingFormSyncErrors,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
  getBehandlingFormValues,
  getBehandlingFormInitialValues,
  getBehandlingFormRegisteredFields,
  hasBehandlingFormErrorsOfType,
} = selectors;
