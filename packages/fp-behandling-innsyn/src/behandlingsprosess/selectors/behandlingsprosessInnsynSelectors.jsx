import { createSelector } from 'reselect';

import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';
import fyt from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import behandlingSelectors from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import createEngangsstonadBpProps from '../definition/engangsstonadInnsynBpDefinition';
import createForeldrepengerBpProps from '../definition/foreldrepengerInnsynBpDefinition';
import { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter } from '../duckBpInnsyn';
import { getFagsakYtelseType } from '../../duckBehandlingInnsyn';

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingType, behandlingSelectors.getAksjonspunkter,
    behandlingSelectors.getBehandlingInnsynResultatType, behandlingSelectors.getBehandlingVilkar],
  (fagsakYtelseType, behandlingType, aksjonspunkter, innsynResultatType, vilkar = []) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      aksjonspunkter,
      vilkar,
      innsynResultatType,
    };

    return fagsakYtelseType.kode === fyt.ENGANGSSTONAD
      ? createEngangsstonadBpProps(builderData) : createForeldrepengerBpProps(builderData);
  },
);

const behandlingspunktInnsynSelectors = getCommonBehandlingsprosessSelectors(
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

export default behandlingspunktInnsynSelectors;
