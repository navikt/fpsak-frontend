import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import getVedtakStatus from './vedtakKlageStatusUtleder';

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const foreldrepengerBuilders = [
  new BehandlingspunktProperties.Builder(bpc.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON, 'FormkravKlageNFP')
    .withAksjonspunktCodes(ac.VURDERING_AV_FORMKRAV_KLAGE_NFP),
  new BehandlingspunktProperties.Builder(bpc.KLAGE_NAV_FAMILIE_OG_PENSJON, 'CheckKlageNFP')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NFP),
  new BehandlingspunktProperties.Builder(bpc.FORMKRAV_KLAGE_NAV_KLAGEINSTANS, 'FormkravKlageKA')
    .withAksjonspunktCodes(ac.VURDERING_AV_FORMKRAV_KLAGE_KA),
  new BehandlingspunktProperties.Builder(bpc.KLAGE_NAV_KLAGEINSTANS, 'CheckKlageNK')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NK),
  new BehandlingspunktProperties.Builder(bpc.KLAGE_RESULTAT, 'ResultatKlage')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createForeldrepengerBpProps = (builderData) => foreldrepengerBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

export default createForeldrepengerBpProps;
