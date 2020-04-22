import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import klageVurdering from '@fpsak-frontend/kodeverk/src/klageVurdering';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { isBGAksjonspunktSomGirFritekstfelt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

const tilbakekrevingMedInntrekk = (tilbakekrevingKode, simuleringResultat) => tilbakekrevingKode === tilbakekrevingVidereBehandling.TILBAKEKR_INFOTRYGD
  && (simuleringResultat.simuleringResultat.sumInntrekk || simuleringResultat.simuleringResultatUtenInntrekk);

export const getTilbakekrevingText = (simuleringResultat, tilbakekrevingvalg, alleKodeverk) => {
  if (tilbakekrevingvalg !== null && tilbakekrevingvalg !== undefined) {
    if (tilbakekrevingMedInntrekk(tilbakekrevingvalg.videreBehandling.kode, simuleringResultat)) {
      return 'VedtakForm.TilbakekrInfotrygdOgInntrekk';
    }
    const getKodeverkNavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    return getKodeverkNavn(tilbakekrevingvalg.videreBehandling);
  }
  return '';
};

export const findInnvilgetResultatText = (behandlingResultatTypeKode, ytelseType) => {
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_YTELSESVEDTAK_STADFESTET) {
    return 'VedtakForm.ResultatOpprettholdVedtak';
  }
  if (behandlingResultatTypeKode === behandlingResultatType.KLAGE_MEDHOLD) {
    return 'VedtakForm.ResultatKlageMedhold';
  }

  if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
    return 'VedtakForm.VilkarStatusInnvilgetEngangsstonad';
  }

  if (ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER) {
    return 'VedtakForm.SvangerskapspengerInnvilget';
  }

  return 'VedtakForm.VilkarStatusInnvilgetForeldrepenger';
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

  if (ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER) {
    return 'VedtakForm.SvangerskapspengerIkkeInnvilget';
  }

  return 'VedtakForm.ForeldrepengerIkkeInnvilget';
};


export const hasIkkeOppfyltSoknadsfristvilkar = (vilkar) => vilkar.some((v) => v.vilkarType.kode === vilkarType.SOKNADFRISTVILKARET
  && v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);


export const medholdIKlage = (klageVurderingResultat) => (klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurdering.MEDHOLD_I_KLAGE);

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

export const skalSkriveFritekstGrunnetFastsettingAvBeregning = (beregningsgrunnlag, aksjonspunkter) => {
  if (!beregningsgrunnlag || !aksjonspunkter) {
    return false;
  }
  const behandlingHarLøstBGAP = aksjonspunkter.find((ap) => isBGAksjonspunktSomGirFritekstfelt(ap.definisjon.kode)
    && ap.status.kode === aksjonspunktStatus.UTFORT);
  const førstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode[0];
  const andelSomErManueltFastsatt = førstePeriode.beregningsgrunnlagPrStatusOgAndel.find((andel) => andel.overstyrtPrAar || andel.overstyrtPrAar === 0);
  return (!!behandlingHarLøstBGAP || !!andelSomErManueltFastsatt);
};
