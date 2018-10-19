import aksjonspunktStatus, { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import bt from 'kodeverk/behandlingType';
import behandlingResultatType, { isAvslag } from 'kodeverk/behandlingResultatType';
import innsynResultatTypeKV from 'kodeverk/innsynResultatType';
import aksjonspunktCodes, { isKlageAksjonspunkt } from 'kodeverk/aksjonspunktCodes';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

// TODO (TOR) refaktorer måten ein finn status for vedtaksbehandlingspunkt
const findVedtakStatusForKlage = (aksjonspunkter, behandlingsresultat) => {
  const allAksjonspunkterIkkeUtfort = aksjonspunkter
    .filter(ap => isKlageAksjonspunkt(ap.definisjon.kode))
    .some(ak => ak.status.kode !== aksjonspunktStatus.UTFORT);
  if (!allAksjonspunkterIkkeUtfort) {
    const resultatTypeCode = behandlingsresultat.type.kode;
    if (resultatTypeCode === behandlingResultatType.KLAGE_AVVIST || resultatTypeCode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }
    return vilkarUtfallType.OPPFYLT;
  }
  return vilkarUtfallType.IKKE_VURDERT;
};

const hasOnlyClosedAps = (aksjonspunkter, vedtakAksjonspunkter) => aksjonspunkter
  .filter(ap => !vedtakAksjonspunkter.some(vap => vap.definisjon.kode === ap.definisjon.kode))
  .every(ap => !isAksjonspunktOpen(ap.status.kode));

const findVedtakStatusForInnsyn = (aksjonspunkter, innsynResultatType) => {
  const akp = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.FORESLA_VEDTAK);
  if (!akp) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_OPPFYLT;
};

const hasAksjonspunkt = ap => (ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING
  || ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG
  || ap.definisjon.kode === aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG
  || ap.definisjon.kode === aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER);

const isAksjonspunktOpenAndOfType = ap => hasAksjonspunkt(ap) && isAksjonspunktOpen(ap.status.kode);

const findStatusForVedtak = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) => {
  if (vilkar.length === 0) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter) && vilkar.some(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }

  if (vilkar.some(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT) || aksjonspunkter.some(isAksjonspunktOpenAndOfType)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (!hasOnlyClosedAps(aksjonspunkter, vedtakAksjonspunkter)) {
    return vilkarUtfallType.IKKE_VURDERT;
  }

  if (isAvslag(behandlingsresultat.type.kode)) {
    return vilkarUtfallType.IKKE_OPPFYLT;
  }
  return vilkarUtfallType.OPPFYLT;
};

const getVedtakStatus = ({
  behandlingType, aksjonspunkter, innsynResultatType, behandlingsresultat, vilkar,
}, vedtakAksjonspunkter) => {
  if (behandlingType.kode === bt.DOKUMENTINNSYN) {
    return findVedtakStatusForInnsyn(aksjonspunkter, innsynResultatType);
  }
  if (behandlingType.kode === bt.KLAGE) {
    return findVedtakStatusForKlage(aksjonspunkter, behandlingsresultat);
  }
  return findStatusForVedtak(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat);
};

export default getVedtakStatus;
