import { createSelector } from 'reselect';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  ProsessStegProperties, Behandling, Aksjonspunkt, Vilkar,
} from '@fpsak-frontend/behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

const hasNonDefaultBehandlingspunkt = ({ behandlingHenlagt }, bpLength) => bpLength > 0 || behandlingHenlagt;

const getVedtakStatus = ({
  behandlingsresultat,
}, bpAksjonspunkter) => {
  const harApentAksjonpunkt = bpAksjonspunkter.some((ap) => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (bpAksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  const resultatTypeCode = behandlingsresultat.type.kode;
  if (resultatTypeCode === behandlingResultatType.KLAGE_AVVIST || resultatTypeCode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};


/**
 * Rekkefølgen i listene under bestemmer steg-rekkefølgen i GUI.
 * @see ProsessStegProperties.Builder for mer informasjon.
 */
const klageBuilders = [
  new ProsessStegProperties.Builder(bpc.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON, 'FormkravKlageNFP')
    .withAksjonspunktCodes(ac.VURDERING_AV_FORMKRAV_KLAGE_NFP),
  new ProsessStegProperties.Builder(bpc.KLAGE_NAV_FAMILIE_OG_PENSJON, 'CheckKlageNFP')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NFP),
  new ProsessStegProperties.Builder(bpc.FORMKRAV_KLAGE_NAV_KLAGEINSTANS, 'FormkravKlageKA')
    .withAksjonspunktCodes(ac.VURDERING_AV_FORMKRAV_KLAGE_KA),
  new ProsessStegProperties.Builder(bpc.KLAGE_NAV_KLAGEINSTANS, 'CheckKlageNK')
    .withAksjonspunktCodes(ac.BEHANDLE_KLAGE_NK),
  new ProsessStegProperties.Builder(bpc.KLAGE_RESULTAT, 'ResultatKlage')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt)
    .withStatus(getVedtakStatus),
];

const createKlageStegProps = (builderData) => klageBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

interface OwnProps {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
}

const finnKlageSteg = createSelector(
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

    return createKlageStegProps(builderData);
  },
);

export default finnKlageSteg;
