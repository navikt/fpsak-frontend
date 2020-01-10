import {
  Behandling, BeregningsresultatFp, Aksjonspunkt, Vilkar, Personopplysninger, Soknad, InntektArbeidYtelse,
  Beregningsgrunnlag, UttakStonadskontoer, UttaksresultatPeriode, SimuleringResultat,
} from '@fpsak-frontend/behandling-felles';

interface FetchedData {
  behandling: Behandling;
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  uttakStonadskontoer: UttakStonadskontoer;
  uttaksresultatPerioder: UttaksresultatPeriode[];
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
