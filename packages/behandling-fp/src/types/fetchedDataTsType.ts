} from '@fpsak-frontend/behandling-felles';
import {
  BeregningsresultatFp, Aksjonspunkt, Vilkar, Personopplysninger, Ytelsefordeling, Soknad, InntektArbeidYtelse,
  Beregningsgrunnlag, UttakStonadskontoer, UttaksresultatPeriode, SimuleringResultat,
} from '@fpsak-frontend/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  ytelsefordeling: Ytelsefordeling;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  uttakStonadskontoer: UttakStonadskontoer;
  uttaksresultatPerioder: UttaksresultatPeriode[];
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
