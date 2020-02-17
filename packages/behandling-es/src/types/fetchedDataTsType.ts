import {
  BeregningsresultatEs, Aksjonspunkt, Vilkar, Personopplysninger, Soknad, InntektArbeidYtelse, SimuleringResultat,
} from '@fpsak-frontend/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  simuleringResultat: SimuleringResultat;
  beregningresultatEngangsstonad: BeregningsresultatEs;
}

export default FetchedData;
