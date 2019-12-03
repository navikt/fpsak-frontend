import { createSelector } from 'reselect';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { ProsessStegProperties } from '@fpsak-frontend/behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import innsynResultatTypeKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

const getVedtakStatus = ({ innsynResultatType }, bpAksjonspunkter) => {
  const harApentAksjonpunkt = bpAksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (bpAksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
};

/**
 * Rekkefølgen i listene under bestemmer steg-rekkefølgen i GUI.
 * @see ProsessStegProperties.Builder for mer informasjon.
 */
const innsynBuilders = [
  new ProsessStegProperties.Builder(bpc.BEHANDLE_INNSYN, 'Innsyn')
    .withAksjonspunktCodes(ac.VURDER_INNSYN),
  new ProsessStegProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createInnsynStegProps = (builderData) => innsynBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

const finnInnsynSteg = createSelector(
  [(ownProps) => ownProps.behandling,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.vilkar,
    (ownProps) => ownProps.innsyn],
  (behandling, aksjonspunkter, vilkar, innsyn) => {
    if (!behandling.type) {
      return undefined;
    }

    const builderData = {
      behandlingType: behandling.type,
      aksjonspunkter,
      vilkar,
      innsynResultatType: innsyn.innsynResultatType,
    };

    return createInnsynStegProps(builderData);
  },
);

export default finnInnsynSteg;
