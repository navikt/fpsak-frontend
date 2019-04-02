import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

export const getForeldelseStatus = ({ foreldelseResultat }) => (foreldelseResultat ? vut.OPPFYLT : vut.IKKE_VURDERT);
export const getTilbakekrevingStatus = () => vut.IKKE_VURDERT;

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const tilbakekrevingBuilders = [
  new BehandlingspunktProperties.Builder(bpc.FORELDELSE, 'Foreldelse')
    .withAksjonspunktCodes(ac.VURDER_FORELDELSE)
    .withVisibilityWhen(() => true)
    .withStatus(getForeldelseStatus),
  new BehandlingspunktProperties.Builder(bpc.TILBAKEKREVING, 'Tilbakekreving')
    .withAksjonspunktCodes(ac.VURDER_FEILUTBETALING)
    .withVisibilityWhen(() => true)
    .withStatus(getTilbakekrevingStatus),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(ac.FORESLA_VEDTAK)
    .withVisibilityWhen(() => true),
];


const createTilbakekrevingBpProps = builderData => tilbakekrevingBuilders.reduce((currentEbs, eb) => {
  const res = eb.build(builderData, currentEbs.length);
  return res.isVisible ? currentEbs.concat([res]) : currentEbs;
}, []);

export default createTilbakekrevingBpProps;
