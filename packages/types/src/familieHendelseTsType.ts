import Kodeverk from './kodeverkTsType';

export type FamilieHendelse = Readonly<{
  skjaringstidspunkt: string;
  avklartBarn?: {
    fodselsdato: string;
    dodsdato?: string;
  }[];
  brukAntallBarnFraTps?: boolean;
  dokumentasjonForeligger?: boolean;
  termindato?: string;
  antallBarnTermin?: number;
  utstedtdato?: string;
  morForSykVedFodsel?: boolean;
  vedtaksDatoSomSvangerskapsuke?: string;
  soknadType: Kodeverk;
  adopsjonFodelsedatoer?: {};
  omsorgsovertakelseDato?: string;
  antallBarnTilBeregning?: number;
}>

export type FamilieHendelseSamling = Readonly<{
  oppgitt: FamilieHendelse;
  gjeldende: FamilieHendelse;
  register: FamilieHendelse;
}>
