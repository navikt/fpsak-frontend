import { Kodeverk } from './kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Aksjonspunkt = Readonly<{
  definisjon: Kodeverk;
  kanLoses: boolean;
  toTrinnsBehandling: boolean;
  toTrinnsBehandlingGodkjent: boolean;
  status: Kodeverk;
}>
