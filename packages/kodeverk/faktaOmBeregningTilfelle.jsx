const faktaOmBeregningTilfelle = {
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD: 'VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD',
  VURDER_SN_NY_I_ARBEIDSLIVET: 'VURDER_SN_NY_I_ARBEIDSLIVET',
  VURDER_NYOPPSTARTET_FL: 'VURDER_NYOPPSTARTET_FL',
  FASTSETT_MAANEDSINNTEKT_FL: 'FASTSETT_MAANEDSINNTEKT_FL',
  FASTSETT_ENDRET_BEREGNINGSGRUNNLAG: 'FASTSETT_ENDRET_BEREGNINGSGRUNNLAG',
  VURDER_LONNSENDRING: 'VURDER_LØNNSENDRING',
  FASTSETT_MAANEDSLONN_VED_LONNSENDRING: 'FASTSETT_MÅNEDSLØNN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING',
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON: 'VURDER_AT_OG_FL_I_SAMME_ORGANISASJON',
  FASTSETT_BESTEBEREGNING_FODENDE_KVINNE: 'FASTSETT_BESTEBEREGNING_FØDENDE_KVINNE',
  TILSTOTENDE_YTELSE: 'TILSTØTENDE_YTELSE',
};

const harLonnsendringOgNyoppstartet = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL);

export const harKunATFLISammeOrgUtenBestebergning = tilfeller => !(tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
  || tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL))
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);

const harLonnsendringNyOppstartetFLOgATFLISammeOrgUtenBesteberegning = tilfeller => harLonnsendringOgNyoppstartet(tilfeller)
  && tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);


export const erSpesialtilfelleMedEkstraKnapp = tilfeller => tilfeller.includes(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE)
  && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG);

export const erATFLSpesialtilfelle = tilfeller => harLonnsendringNyOppstartetFLOgATFLISammeOrgUtenBesteberegning(tilfeller);

export default faktaOmBeregningTilfelle;
