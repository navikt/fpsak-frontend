import { BehandlingspunktProperties } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import ac from '../../kodeverk/tilbakekrevingAksjonspunktCodes';
import VedtakResultatType from '../../kodeverk/vedtakResultatType';

export const getForeldelseStatus = ({ foreldelseResultat }) => (foreldelseResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT);
const getVedtakStatus = ({ beregningsresultat }) => {
  if (!beregningsresultat) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  const { vedtakResultatType } = beregningsresultat;
  return vedtakResultatType.kode === VedtakResultatType.INGEN_TILBAKEBETALING ? vilkarUtfallType.IKKE_OPPFYLT : vilkarUtfallType.OPPFYLT;
};

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
    .withAksjonspunktCodes(ac.VURDER_TILBAKEKREVING)
    .withVisibilityWhen(() => true),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(ac.FORESLA_VEDTAK)
    .withVisibilityWhen(() => true)
    .withStatus(getVedtakStatus),
];

const createTilbakekrevingBpProps = (builderData) => tilbakekrevingBuilders.reduce((currentEbs, eb) => {
  const res = eb.build(builderData, currentEbs.length);
  return res.isVisible ? currentEbs.concat([res]) : currentEbs;
}, []);

export default createTilbakekrevingBpProps;
