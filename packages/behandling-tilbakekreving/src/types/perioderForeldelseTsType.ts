import { Kodeverk } from '@fpsak-frontend/types';

type PerioderForeldelse = Readonly<{
  perioder: {
    fom: string;
    tom: string;
    belop: number;
    foreldelseVurderingType: Kodeverk;
  };
}>

export default PerioderForeldelse;
