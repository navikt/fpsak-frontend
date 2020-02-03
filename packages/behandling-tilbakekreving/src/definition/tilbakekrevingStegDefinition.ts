import { createSelector } from 'reselect';

import { ProsessStegProperties } from '@fpsak-frontend/behandling-felles';
import { Behandling, Aksjonspunkt } from '@fpsak-frontend/types';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import VedtakResultatType from '../kodeverk/vedtakResultatType';
import PerioderForeldelse from '../types/perioderForeldelseTsType';
import Beregningsresultat from '../types/beregningsresultatTsType';

export const getForeldelseStatus = ({ foreldelseResultat }) => (foreldelseResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT);
const getVedtakStatus = ({ beregningsresultat }) => {
  if (!beregningsresultat) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  const { vedtakResultatType } = beregningsresultat;
  return vedtakResultatType.kode === VedtakResultatType.INGEN_TILBAKEBETALING ? vilkarUtfallType.IKKE_OPPFYLT : vilkarUtfallType.OPPFYLT;
};

/**
 * Rekkefølgen i listene under bestemmer steg-rekkefølgen i GUI.
 * @see ProsessStegProperties.Builder for mer informasjon.
 */
const tilbakekrevingBuilders = [
  new ProsessStegProperties.Builder(bpc.FORELDELSE, 'Foreldelse')
    .withAksjonspunktCodes(ac.VURDER_FORELDELSE)
    .withVisibilityWhen(() => true)
    .withStatus(getForeldelseStatus),
  new ProsessStegProperties.Builder(bpc.TILBAKEKREVING, 'Tilbakekreving')
    .withAksjonspunktCodes(ac.VURDER_TILBAKEKREVING)
    .withVisibilityWhen(() => true),
  new ProsessStegProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(ac.FORESLA_VEDTAK)
    .withVisibilityWhen(() => true)
    .withStatus(getVedtakStatus),
];

const createTilbakekrevingStegProps = (builderData) => tilbakekrevingBuilders.reduce((currentEbs, eb) => {
  const res = eb.build(builderData, currentEbs.length);
  return res.isVisible ? currentEbs.concat([res]) : currentEbs;
}, []);

interface OwnProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  perioderForeldelse: PerioderForeldelse;
  beregningsresultat: Beregningsresultat;
}

const finnTilbakekrevingSteg = createSelector(
  [(ownProps: OwnProps) => ownProps.behandling,
    (ownProps: OwnProps) => ownProps.aksjonspunkter,
    (ownProps: OwnProps) => ownProps.perioderForeldelse,
    (ownProps: OwnProps) => ownProps.beregningsresultat],
  (behandling, aksjonspunkter, foreldelseResultat, beregningsresultat) => {
    if (!behandling.type) {
      return undefined;
    }

    const builderData = {
      behandlingType: behandling.type,
      behandlingHenlagt: behandling.behandlingHenlagt,
      aksjonspunkter,
      vilkar: [],
      foreldelseResultat,
      beregningsresultat,
    };

    return createTilbakekrevingStegProps(builderData);
  },
);

export default finnTilbakekrevingSteg;
