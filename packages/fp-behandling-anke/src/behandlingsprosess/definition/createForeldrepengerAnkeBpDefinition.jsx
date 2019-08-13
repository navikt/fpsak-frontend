import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const foreldrepengerBuilders = [
  new BehandlingspunktProperties.Builder(bpc.ANKEBEHANDLING, 'Ankebehandling')
    .withAksjonspunktCodes(ac.MANUELL_VURDERING_AV_ANKE),
  new BehandlingspunktProperties.Builder(bpc.ANKE_RESULTAT, 'AnkeResultat')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL,
    ),
  new BehandlingspunktProperties.Builder(bpc.ANKE_MERKNADER, 'AnkeMerknader')
    .withAksjonspunktCodes(ac.MANUELL_VURDERING_AV_ANKE_MERKNADER, ac.AUTO_VENT_ANKE_MERKNADER_FRA_BRUKER)
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt),
];

const createForeldrepengerAnkeBpDefinition = builderData => foreldrepengerBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

export default createForeldrepengerAnkeBpDefinition;
