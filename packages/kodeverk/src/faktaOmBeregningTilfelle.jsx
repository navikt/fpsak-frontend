const faktaOmBeregningTilfelle = {
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD: 'VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD',
  VURDER_SN_NY_I_ARBEIDSLIVET: 'VURDER_SN_NY_I_ARBEIDSLIVET',
  VURDER_NYOPPSTARTET_FL: 'VURDER_NYOPPSTARTET_FL',
  FASTSETT_MAANEDSINNTEKT_FL: 'FASTSETT_MAANEDSINNTEKT_FL',
  VURDER_LONNSENDRING: 'VURDER_LØNNSENDRING',
  FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING: 'FASTSETT_MÅNEDSLØNN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING',
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON: 'VURDER_AT_OG_FL_I_SAMME_ORGANISASJON',
  FASTSETT_BESTEBEREGNING_FODENDE_KVINNE: 'FASTSETT_BESTEBEREGNING_FØDENDE_KVINNE',
  VURDER_ETTERLONN_SLUTTPAKKE: 'VURDER_ETTERLØNN_SLUTTPAKKE',
  FASTSETT_ETTERLONN_SLUTTPAKKE: 'FASTSETT_ETTERLØNN_SLUTTPAKKE',
  FASTSETT_BG_KUN_YTELSE: 'FASTSETT_BG_KUN_YTELSE',
  VURDER_MOTTAR_YTELSE: 'VURDER_MOTTAR_YTELSE',
  VURDER_BESTEBEREGNING: 'VURDER_BESTEBEREGNING',
  VURDER_MILITÆR_SIVILTJENESTE: 'VURDER_MILITÆR_SIVILTJENESTE',
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT: 'VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT',
};

const besteberegningTilfeller = [
  faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING,
  faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];

export const vurderOgFastsettATFLTilfeller = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
  faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
  faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE,
  faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING,
  faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE,
  faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING];

export const fastsettATLIntersection = (tilfeller) => vurderOgFastsettATFLTilfeller.filter((tilfelle) => tilfeller.includes(tilfelle));

const harLonnsendringOgNyoppstartet = (tilfeller) => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);

const harIkkeLonnsendringEllerNyoppstartet = (tilfeller) => !(tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
|| tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL));

export const harVurderMottarYtelse = (tilfeller) => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE);

export const harKunATFLISammeOrg = (tilfeller) => (harIkkeLonnsendringEllerNyoppstartet(tilfeller)
  || harVurderMottarYtelse(tilfeller))
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);

const harLonnsendringNyOppstartetFLOgATFLISammeOrg = (tilfeller) => harLonnsendringOgNyoppstartet(tilfeller)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);

export const erATFLSpesialtilfelle = (tilfeller) => harLonnsendringNyOppstartetFLOgATFLISammeOrg(tilfeller);

export const erATFLSpesialtilfelleEllerVurderMottarYtelse = (tilfeller) => erATFLSpesialtilfelle(tilfeller)
|| harVurderMottarYtelse(tilfeller);

export const harIkkeATFLSameOrg = (tilfeller) => !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);

export const harFastsettATFLInntektTilfelleUtenomBesteberegning = (tilfeller) => tilfeller.some((tilfelle) => vurderOgFastsettATFLTilfeller.includes(tilfelle)
  && !besteberegningTilfeller.includes(tilfelle));

export default faktaOmBeregningTilfelle;
