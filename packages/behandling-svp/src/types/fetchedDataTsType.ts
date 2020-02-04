import {
  BeregningsresultatFp, Aksjonspunkt, Vilkar, Personopplysninger, Soknad, InntektArbeidYtelse,
  Beregningsgrunnlag, SimuleringResultat,
} from '@fpsak-frontend/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
