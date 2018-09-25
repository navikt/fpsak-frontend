import behandlingResultatType from '@fpsak-frontend/kodeverk/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/vilkarType';
import klageVurdering from '@fpsak-frontend/kodeverk/klageVurdering';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/vilkarUtfallType';
import { minLength, maxLength } from '@fpsak-frontend/utils/validation/validators';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import { isBGAksjonspunktSomGirFritekstfelt } from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/aksjonspunktStatus';

export const findInnvilgetResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  } if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }


  if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
    return 'VedtakForm.VilkarStatusInnvilgetEngangsstonad';
  }

  return 'VedtakForm.VilkarStatusInnvilgetForeldrepenger';
};

export const findAvslagResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return 'VedtakForm.ResultatKlageYtelsesvedtakOpphevet';
  } if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_AVVIST) {
    return 'VedtakForm.ResultatKlageAvvist';
  }

  if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
    return 'VedtakForm.EngangsstonadIkkeInnvilget';
  }

  return 'VedtakForm.ForeldrepengerIkkeInnvilget';
};


export const hasIkkeOppfyltSoknadsfristvilkar = vilkar => vilkar.some(v => v.vilkarType.kode === vilkarType.SOKNADFRISTVILKARET
  && v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);


export const medholdIKlage = klageVurderingResultat => (klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE);

export const hasKlageVurderingSomIkkeErAvvist = (klageVurderingResultatNFP, klageVurderingResultatNK) => {
  const isKlageVurderingNfpAvvisKlage = klageVurderingResultatNFP
    && klageVurderingResultatNFP.klageVurdering === klageVurdering.AVVIS_KLAGE;
  const isKlageVurderingNkAvvisKlage = klageVurderingResultatNK
    && klageVurderingResultatNK.klageVurdering === klageVurdering.AVVIS_KLAGE;
  const isKlageVurderingNkMedholdKlage = klageVurderingResultatNK
    && klageVurderingResultatNK.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE;
  return !(isKlageVurderingNfpAvvisKlage || isKlageVurderingNkAvvisKlage || isKlageVurderingNkMedholdKlage);
};

export const shouldGiveBegrunnelse = (
  klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus,
) => behandlingStatus === behandlingStatusCode.BEHANDLING_UTREDES
  && (hasIkkeOppfyltSoknadsfristvilkar(vilkar)
    || hasKlageVurderingSomIkkeErAvvist(klageVurderingResultatNFP, klageVurderingResultatNK));

export const endringerIBeregningsgrunnlagGirFritekstfelt = (aksjonspunkter, ytelseType) => {
  if (ytelseType === fagsakYtelseType.ENGANGSSTONAD || aksjonspunkter === undefined || aksjonspunkter.length < 1) {
    return false;
  }
  return aksjonspunkter.find(ap => isBGAksjonspunktSomGirFritekstfelt(ap.definisjon.kode)
    && ap.status.kode === aksjonspunktStatus.UTFORT) !== undefined;
};
export const maxLength1500 = (0, maxLength)(1500);
export const minLength3 = (0, minLength)(3);
