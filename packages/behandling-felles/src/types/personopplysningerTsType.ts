import Kodeverk from './kodeverkTsType';

type Personopplysninger = Readonly<{
  nummer?: number;
  navBrukerKjonn: Kodeverk;
  statsborgerskap: Kodeverk;
  avklartPersonstatus: {
    orginalPersonstatus: Kodeverk;
    overstyrtPersonstatus: Kodeverk;
  };
  personstatus: Kodeverk;
  diskresjonskode: Kodeverk;
  sivilstand: Kodeverk;
  aktoerId: string;
  navn: string;
  dodsdato?: string;
  fodselsdato?: string;
  adresser: {
    adresseType?: Kodeverk;
    adresselinje1?: string;
    adresselinje2?: string;
    adresselinje3?: string;
    postNummer?: string;
    poststed?: string;
    land?: string;
    mottakerNavn?: string;
  }[];
  fnr?: string;
  region: Kodeverk;
  annenPart?: {};
  barn: {}[];
  harVerge?: boolean;
  barnSoktFor?: {}[] ;
  barnFraTpsRelatertTilSoknad?: {}[];
}>

export default Personopplysninger;
