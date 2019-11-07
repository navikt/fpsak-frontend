import { createSelector } from 'reselect';

import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from '../../selectors/ankeBehandlingSelectors';
import { getOverrideBehandlingspunkter, getSelectedBehandlingspunktNavn } from '../duckBpAnke';
import { getFagsakYtelseType } from '../../duckBehandlingAnke';
import createForeldrepengerAnkeBpDefinition from '../definition/createForeldrepengerAnkeBpDefinition';

// Kun eksport for test. Ikke bruk direkte!!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingType, behandlingSelectors.getAksjonspunkter, behandlingSelectors.getBehandlingsresultat,
    behandlingSelectors.getBehandlingVilkar],
  (fagsakYtelseType, behandlingType, aksjonspunkter, behandlingsresultat, vilkar = []) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      vilkar,
      aksjonspunkter,
      behandlingsresultat,
    };

    return createForeldrepengerAnkeBpDefinition(builderData);
  },
);

const behandlingspunktAnkeSelectors = getCommonBehandlingsprosessSelectors(
  getBehandlingspunkterProps,
  behandlingSelectors.getAksjonspunkter,
  behandlingSelectors.getBehandlingIsOnHold,
  behandlingSelectors.getAllMerknaderFraBeslutter,
  behandlingSelectors.hasReadOnlyBehandling,
  behandlingSelectors.isBehandlingStatusReadOnly,
  getSelectedBehandlingspunktNavn,
  getOverrideBehandlingspunkter,
  behandlingSelectors.getRettigheter,
);

export default behandlingspunktAnkeSelectors;
