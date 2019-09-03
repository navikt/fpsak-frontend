import { createSelector } from 'reselect';

import fyt from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  getBehandlingResultatstruktur,
  getSimuleringResultat,
  getStonadskontoer,
  getUttaksresultatPerioder,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import createEngangsstonadBpProps from '../definition/engangsstonadBpDefinition';
import createForeldrepengerBpProps from '../definition/foreldrepengerBpDefinition';
import createSvangerskapspengerBpProps from '../definition/svangerskapspengerBpDefinition';
import { getOverrideBehandlingspunkter, getSelectedBehandlingspunktNavn } from '../duckBpForstegangOgRev';
import { getFagsakYtelseType, getFeatureToggles } from '../../duckBehandlingForstegangOgRev';

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingType, behandlingSelectors.getBehandlingVilkar, behandlingSelectors.getAksjonspunkter,
    behandlingSelectors.getBehandlingsresultat, getBehandlingResultatstruktur, getStonadskontoer, getFeatureToggles, getUttaksresultatPerioder,
    getSimuleringResultat],
  (fagsakYtelseType, behandlingType, vilkar = [], aksjonspunkter, behandlingsresultat,
    resultatstruktur, stonadskontoer, featureToggles, uttaksresultat, simuleringResultat) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      vilkar,
      aksjonspunkter,
      behandlingsresultat,
      resultatstruktur,
      stonadskontoer,
      featureToggles,
      uttaksresultat,
      simuleringResultat,
      fagsakYtelseType,
    };

    if (fagsakYtelseType.kode === fyt.ENGANGSSTONAD) {
      return createEngangsstonadBpProps(builderData);
    } if (fagsakYtelseType.kode === fyt.SVANGERSKAPSPENGER) {
      return createSvangerskapspengerBpProps(builderData);
    }
    return createForeldrepengerBpProps(builderData);
  },
);

const behandlingspunktForstegangOgRevSelectors = getCommonBehandlingsprosessSelectors(
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

export default behandlingspunktForstegangOgRevSelectors;
