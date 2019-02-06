import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes as bpc, BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const tilbakekrevingBuilders = [
  new BehandlingspunktProperties.Builder(bpc.TILBAKEKREVING, 'Tilbakekreving')
    .withAksjonspunktCodes(ac.TILBAKEKREVING)
    .withVisibilityWhen(() => true),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(ac.FORESLA_VEDTAK)
    .withVisibilityWhen(() => true),
];


const createTilbakekrevingBpProps = builderData => tilbakekrevingBuilders.reduce((currentEbs, eb) => {
  const res = eb.build(builderData, currentEbs.length);
  return res.isVisible ? currentEbs.concat([res]) : currentEbs;
}, []);

export default createTilbakekrevingBpProps;
