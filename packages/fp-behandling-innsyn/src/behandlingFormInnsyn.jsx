import { getBehandlingForm, getBehandlingFormSelectors } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { getSelectedBehandlingId } from './duckBehandlingInnsyn';

/**
 * behandlingFormInnsyn
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const behandlingFormInnsyn = (config = {}) => WrappedComponent => getBehandlingForm(
  config, WrappedComponent, getSelectedBehandlingId, behandlingSelectors.getBehandlingVersjon,
);

const selectors = getBehandlingFormSelectors(getSelectedBehandlingId, behandlingSelectors.getBehandlingVersjon);

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
