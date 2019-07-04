import { createSelector } from 'reselect';

import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';

import { getRettigheter } from 'navAnsatt/duck';
import {
  getBehandlingType, getBehandlingVilkar, getAksjonspunkter, getBehandlingsresultat, getBehandlingIsOnHold, getAllMerknaderFraBeslutter,
  hasReadOnlyBehandling, isBehandlingStatusReadOnly,
} from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter } from '../duckBpAnke';
import { getFagsakYtelseType } from '../../duckAnke';
import createForeldrepengerAnkeBpDefinition from '../definition/createForeldrepengerAnkeBpDefinition';

const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, getBehandlingType, getAksjonspunkter, getBehandlingsresultat, getBehandlingVilkar],
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
  getAksjonspunkter,
  getBehandlingIsOnHold,
  getAllMerknaderFraBeslutter,
  hasReadOnlyBehandling,
  isBehandlingStatusReadOnly,
  getSelectedBehandlingspunktNavn,
  getOverrideBehandlingspunkter,
  getRettigheter,
);

export default behandlingspunktAnkeSelectors;
