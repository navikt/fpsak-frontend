import Kodeverk from './kodeverkTsType';

type PersonopplysningerBasic = Readonly<{
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
  aktoerId?: string;
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
  harVerge?: boolean;
}>

type Personopplysninger = Readonly<PersonopplysningerBasic & {
  annenPart?: PersonopplysningerBasic & {
    barn: PersonopplysningerBasic[];
    barnSoktFor?: PersonopplysningerBasic[] ;
    barnFraTpsRelatertTilSoknad?: PersonopplysningerBasic[];
  };
  barn: PersonopplysningerBasic[];
  barnSoktFor?: PersonopplysningerBasic[] ;
  barnFraTpsRelatertTilSoknad?: PersonopplysningerBasic[];
}>

export default Personopplysninger;
