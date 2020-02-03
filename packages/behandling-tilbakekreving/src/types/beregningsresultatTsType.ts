import { Kodeverk } from '@fpsak-frontend/types';

type Beregningsresultat = Readonly<{
  beregningResultatPerioder: {}[];
  vedtakResultatType: Kodeverk;
}>

export default Beregningsresultat;
