import { Kodeverk } from '@fpsak-frontend/behandling-felles';

type Beregningsresultat = Readonly<{
  beregningResultatPerioder: {}[];
  vedtakResultatType: Kodeverk;
}>

export default Beregningsresultat;
