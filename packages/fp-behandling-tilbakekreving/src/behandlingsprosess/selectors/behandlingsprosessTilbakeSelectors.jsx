import { createSelector } from 'reselect';

import { getCommonBehandlingsprosessSelectors } from '@fpsak-frontend/fp-behandling-felles';

import { getRettigheter } from 'navAnsatt/duck';
import behandlingSelectors from '../../selectors/tilbakekrevingBehandlingSelectors';
import createTilbakekrevingBpProps from '../definition/tilbakekrevingBpDefinition';
import { getSelectedBehandlingspunktNavn, getOverrideBehandlingspunkter } from '../duckBpTilbake';
import { getFagsakYtelseType } from '../../duckBehandlingTilbakekreving';

// Kun eksportert for test. Ikke bruk andre steder!
export const getBehandlingspunkterProps = createSelector(
  [getFagsakYtelseType, behandlingSelectors.getBehandlingType, behandlingSelectors.getBehandlingVilkar,
    behandlingSelectors.getAksjonspunkter, behandlingSelectors.getForeldelsePerioder, behandlingSelectors.getBeregningsresultat],
  (fagsakYtelseType, behandlingType, vilkar = [], aksjonspunkter, foreldelseResultat, beregningsresultat) => {
    if (!behandlingType) {
      return undefined;
    }

    const builderData = {
      behandlingType,
      vilkar,
      aksjonspunkter,
      foreldelseResultat,
      beregningsresultat,
    };

    return createTilbakekrevingBpProps(builderData);
  },
);

const behandlingspunktTilbakekrevingSelectors = getCommonBehandlingsprosessSelectors(
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

export default behandlingspunktTilbakekrevingSelectors;
