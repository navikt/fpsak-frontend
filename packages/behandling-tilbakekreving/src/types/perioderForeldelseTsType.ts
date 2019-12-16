import { Kodeverk } from '@fpsak-frontend/behandling-felles';

type PerioderForeldelse = Readonly<{
  perioder: {
    fom: string;
    tom: string;
    belop: number;
    foreldelseVurderingType: Kodeverk;
  };
}>

export default PerioderForeldelse;
