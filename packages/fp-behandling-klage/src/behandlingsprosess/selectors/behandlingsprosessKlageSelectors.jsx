import { createSelector } from 'reselect';

import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';
import fyt from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getRettigheter } from 'navAnsatt/duck';
import behandlingSelectors from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import createEngangsstonadBpProps from '../definition/engangsstonadKlageBpDefinition';
import createForeldrepengerBpProps from '../definition/foreldrepengerKlageBpDefinition';
import { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter } from '../duckBpKlage';
import { getFagsakYtelseType } from '../../duckBehandlingKlage';

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingType, behandlingSelectors.getBehandlingVilkar,
    behandlingSelectors.getAksjonspunkter, behandlingSelectors.getBehandlingsresultat],
  (fagsakYtelseType, behandlingType, vilkar = [], aksjonspunkter, behandlingsresultat) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      vilkar,
      aksjonspunkter,
      behandlingsresultat,
    };

    return fagsakYtelseType.kode === fyt.ENGANGSSTONAD
      ? createEngangsstonadBpProps(builderData) : createForeldrepengerBpProps(builderData);
  },
);

const behandlingspunktKlageSelectors = getCommonBehandlingsprosessSelectors(
  getBehandlingspunkterProps,
  behandlingSelectors.getAksjonspunkter,
  behandlingSelectors.getBehandlingIsOnHold,
  behandlingSelectors.getAllMerknaderFraBeslutter,
  behandlingSelectors.hasReadOnlyBehandling,
  behandlingSelectors.isBehandlingStatusReadOnly,
  getSelectedBehandlingspunktNavn,
  getOverrideBehandlingspunkter,
  getRettigheter,
);

export default behandlingspunktKlageSelectors;
