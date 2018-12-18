import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { minLength, maxLength } from '@fpsak-frontend/utils';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isBGAksjonspunktSomGirFritekstfelt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import avregningCodes from '@fpsak-frontend/kodeverk/src/avregningCodes';

export const findInnvilgetResultatText = (behandlingResultatTypeKode, ytelseType, tilbakekrevingValg) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  const tilbakekrevingTypeText = tilbakekrevingValg && tilbakekrevingValg.videreBehandling.kode !== avregningCodes.TILBAKEKR_IGNORER
    ? `.${tilbakekrevingValg.videreBehandling.kode}` : '';

  if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
    return `VedtakForm.VilkarStatusInnvilgetEngangsstonad${tilbakekrevingTypeText}`;
  }

  return `VedtakForm.VilkarStatusInnvilgetForeldrepenger${tilbakekrevingTypeText}`;
};

export const findAvslagResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET) {
    return 'VedtakForm.ResultatKlageYtelsesvedtakOpphevet';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_AVVIST) {
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
