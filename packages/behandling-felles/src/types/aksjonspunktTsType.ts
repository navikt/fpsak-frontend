import { Kodeverk } from './kodeverkTsType';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Aksjonspunkt = Readonly<{
  definisjon: Kodeverk;
  status: Kodeverk;
  begrunnelse: string;
  vilkarType?: Kodeverk;
  toTrinnsBehandling?: boolean;
  toTrinnsBehandlingGodkjent?: boolean;
  vurderPaNyttArsaker?: [Kodeverk];
  besluttersBegrunnelse?: string;
  aksjonspunktType?: Kodeverk;
  kanLoses: boolean;
  erAktivt: boolean;
}>
