import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
<<<<<<< HEAD:packages/fp-behandling-tilbakekreving/src/behandlingsprosess/definition/tilbakekrevingBpDefinition.jsx
import { behandlingspunktCodes as bpc, BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
=======
import bpc from 'behandlingFelles/behandlingsprosess/behandlingspunktCodes';
import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

export const getTilbakekrevingStatus = () => vut.OPPFYLT;
>>>>>>> NOJIRA struktur for tilbakekreving behandlingsprosses:packages/fpsak/src/behandlingTilbakekreving/behandlingsprosess/definition/tilbakekrevingBpDefinition.jsx

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const tilbakekrevingBuilders = [
  new BehandlingspunktProperties.Builder(bpc.FORELDELSE, 'Foreldelse')
    .withAksjonspunktCodes(ac.FORELDELSE)
    .withVisibilityWhen(() => true)
    .withStatus(getTilbakekrevingStatus),
  new BehandlingspunktProperties.Builder(bpc.TILBAKEKREVING, 'Tilbakekreving')
    .withAksjonspunktCodes(ac.TILBAKEKREVING)
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
