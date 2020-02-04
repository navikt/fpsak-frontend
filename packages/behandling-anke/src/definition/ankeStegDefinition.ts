import { createSelector } from 'reselect';

import {
  ProsessStegProperties,
} from '@fpsak-frontend/behandling-felles';
import {
  Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/types';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const hasNonDefaultBehandlingspunkt = ({ behandlingHenlagt }, bpLength) => bpLength > 0 || behandlingHenlagt;

/**
 * Rekkefølgen i listene under bestemmer steg-rekkefølgen i GUI.
 * @see ProsessStegProperties.Builder for mer informasjon.
 */
const ankeBuilders = [
  new ProsessStegProperties.Builder(bpc.ANKEBEHANDLING, 'Ankebehandling')
    .withAksjonspunktCodes(ac.MANUELL_VURDERING_AV_ANKE),
  new ProsessStegProperties.Builder(bpc.ANKE_RESULTAT, 'AnkeResultat')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL,
    ),
  new ProsessStegProperties.Builder(bpc.ANKE_MERKNADER, 'AnkeMerknader')
    .withAksjonspunktCodes(ac.MANUELL_VURDERING_AV_ANKE_MERKNADER, ac.AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER)
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt),
];

const createAnkeStegProps = (builderData) => ankeBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

interface OwnProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
}

const finnAnkeSteg = createSelector(
  [(ownProps: OwnProps) => ownProps.behandling,
    (ownProps: OwnProps) => ownProps.aksjonspunkter,
    (ownProps: OwnProps) => ownProps.vilkar],
  (behandling, aksjonspunkter, vilkar) => {
    if (!behandling.type) {
      return undefined;
    }

    const builderData = {
      behandlingType: behandling.type,
      behandlingHenlagt: behandling.behandlingHenlagt,
      aksjonspunkter,
      vilkar,
      behandlingsresultat: behandling.behandlingsresultat,
    };

    return createAnkeStegProps(builderData);
  },
);

export default finnAnkeSteg;
