import { getBehandlingForm, getBehandlingFormSelectors } from '@fpsak-frontend/fp-felles';

import behandlingSelectors from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { getSelectedBehandlingId } from './duckBehandlingKlage';

/**
 * behandlingFormKlage
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const behandlingFormKlage = (config = {}) => WrappedComponent => getBehandlingForm(
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
