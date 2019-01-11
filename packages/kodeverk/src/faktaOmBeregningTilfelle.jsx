const faktaOmBeregningTilfelle = {
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD: 'VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD',
  VURDER_SN_NY_I_ARBEIDSLIVET: 'VURDER_SN_NY_I_ARBEIDSLIVET',
  VURDER_NYOPPSTARTET_FL: 'VURDER_NYOPPSTARTET_FL',
  FASTSETT_MAANEDSINNTEKT_FL: 'FASTSETT_MAANEDSINNTEKT_FL',
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG: 'FASTSETT_ENDRET_BEREGNINGSGRUNNLAG',
  VURDER_LONNSENDRING: 'VURDER_LØNNSENDRING',
  FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING: 'FASTSETT_MÅNEDSLØNN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING',
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON: 'VURDER_AT_OG_FL_I_SAMME_ORGANISASJON',
  FASTSETT_BESTEBEREGNING_FODENDE_KVINNE: 'FASTSETT_BESTEBEREGNING_FØDENDE_KVINNE',
  TILSTOTENDE_YTELSE: 'TILSTØTENDE_YTELSE',
  VURDER_ETTERLONN_SLUTTPAKKE: 'VURDER_ETTERLØNN_SLUTTPAKKE',
  FASTSETT_ETTERLONN_SLUTTPAKKE: 'FASTSETT_ETTERLØNN_SLUTTPAKKE',
  FASTSETT_BG_KUN_YTELSE: 'FASTSETT_BG_KUN_YTELSE',
  VURDER_MOTTAR_YTELSE: 'VURDER_MOTTAR_YTELSE',
};

export const vurderOgFastsettATFLTilfeller = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  faktaOmBeregningTilfelle.VURDER_LONNSENDRING,
  faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL,
  faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE];


export const fastsettATLIntersection = tilfeller => vurderOgFastsettATFLTilfeller.filter(tilfelle => tilfeller.includes(tilfelle));

const harLonnsendringOgNyoppstartet = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);

const harIkkeLonnsendringEllerNyoppstartet = tilfeller => !(tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
|| tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL));

export const harVurderMottarYtelseUtenBesteberegning = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE)
&& !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);

export const harKunATFLISammeOrgUtenBestebergning = tilfeller => (harIkkeLonnsendringEllerNyoppstartet(tilfeller)
  || harVurderMottarYtelseUtenBesteberegning(tilfeller))
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);

const harLonnsendringNyOppstartetFLOgATFLISammeOrgUtenBesteberegning = tilfeller => harLonnsendringOgNyoppstartet(tilfeller)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);

export const erSpesialtilfelleMedEkstraKnapp = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE)
  && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG);

export const erATFLSpesialtilfelle = tilfeller => harLonnsendringNyOppstartetFLOgATFLISammeOrgUtenBesteberegning(tilfeller);

export const erATFLSpesialtilfelleEllerVurderMottarYtelseUtenBesteberegning = tilfeller => erATFLSpesialtilfelle(tilfeller)
|| harVurderMottarYtelseUtenBesteberegning(tilfeller);

export const harIkkeATFLSameOrgEllerBesteberegning = tilfeller => !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE)
  && !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);

export default faktaOmBeregningTilfelle;
