import { Kodeverk } from '@fpsak-frontend/types';

type Risikoklassifisering = Readonly<{
  kontrollresultat: Kodeverk;
  faresignalVurdering?: Kodeverk;
  iayFaresignaler?: {
    faresignaler: string[];
  };
  medlFaresignaler?: {
    faresignaler: string[];
  };
}>

export default Risikoklassifisering;
