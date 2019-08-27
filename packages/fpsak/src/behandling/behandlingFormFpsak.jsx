import { getBehandlingForm, getBehandlingFormSelectors } from '@fpsak-frontend/fp-felles';

import { getSelectedBehandlingId, getBehandlingVersjon } from './duck';

/**
 * behandlingFormFpsak
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const behandlingFormFpsak = (config = {}) => (WrappedComponent) => getBehandlingForm(
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
