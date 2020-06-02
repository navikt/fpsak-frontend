import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import region from '@fpsak-frontend/kodeverk/src/region';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';

import alleKodeverk from '../mocks/alleKodeverk.json';

export default {
  title: 'sak/sak-visittkort',
  component: VisittkortSakIndex,
  decorators: [withKnobs],
};

const fagsak = {
  saksnummer: 123456,
  sakstype: {
    kode: fagsakYtelseType.FORELDREPENGER,
    kodeverk: 'SAKSTYPE',
  },
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: 'RELASJONS_ROLLE_TYPE',
  },
  status: {
    kode: fagsakStatus.LOPENDE,
    kodeverk: 'STATUS',
  },
  barnFodt: '20120-01-01',
  person: {
    erDod: false,
    navn: 'Espen Utvikler',
    alder: 41,
    personnummer: '1234567',
    erKvinne: false,
    personstatusType: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  opprettet: '20120-01-01',
  endret: '20120-01-01',
  antallBarn: 1,
  kanRevurderingOpprettes: false,
  skalBehandlesAvInfotrygd: false,
  dekningsgrad: 100,
};

const familieHendelse = {
  oppgitt: {
    skjaringstidspunkt: '2020-01-01',
    avklartBarn: [],
    termindato: '2020-01-21',
    soknadType: {
      kode: soknadType.FODSEL,
      kodeverk: 'SOKNAD_TYPE',
    },
  },
  gjeldende: {
    skjaringstidspunkt: '2020-01-01',
    soknadType: {
      kode: soknadType.FODSEL,
      kodeverk: 'SOKNAD_TYPE',
    },
  },
  register: {
    skjaringstidspunkt: '2020-01-01',
    soknadType: {
      kode: soknadType.FODSEL,
      kodeverk: 'SOKNAD_TYPE',
    },
  },
};

const personopplysningerSoker = {
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
    kodeverk: 'NAV_BRUKER_KJONN',
  },
  statsborgerskap: {
    kode: 'NORSK',
    kodeverk: 'STATSBORGERSKAP',
  },
  avklartPersonstatus: {
    orginalPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    overstyrtPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
  diskresjonskode: {
    kode: diskresjonskodeType.KLIENT_ADRESSE,
    kodeverk: 'DISKRESJONSKODE_TYPE',
  },
  sivilstand: {
    kode: sivilstandType.SAMBOER,
    kodeverk: 'SIVILSTAND_TYPE',
  },
  aktoerId: '24sedfs32',
  navn: 'Olga Utvikler',
  adresser: [{
    adresseType: {
      kode: opplysningAdresseType.BOSTEDSADRESSE,
      kodeverk: 'ADRESSE_TYPE',
    },
    adresselinje1: 'Oslo',
  }],
  fnr: '98773895',
  region: {
    kode: region.NORDEN,
    kodeverk: 'REGION',
  },
  barn: [],
};

const personopplysningerAnnenPart = {
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
    kodeverk: 'NAV_BRUKER_KJONN',
  },
  statsborgerskap: {
    kode: 'NORSK',
    kodeverk: 'STATSBORGERSKAP',
  },
  avklartPersonstatus: {
    orginalPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    overstyrtPersonstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
  diskresjonskode: {
    kode: diskresjonskodeType.KLIENT_ADRESSE,
    kodeverk: 'DISKRESJONSKODE_TYPE',
  },
  sivilstand: {
    kode: sivilstandType.SAMBOER,
    kodeverk: 'SIVILSTAND_TYPE',
  },
  aktoerId: '23rwerfwegwerg',
  navn: 'Tusse Trolls Gasse Avle Sønvis Eggert Offer Tønne Sjønning',
  adresser: [{
    adresseType: {
      kode: opplysningAdresseType.BOSTEDSADRESSE,
      kodeverk: 'ADRESSE_TYPE',
    },
    adresselinje1: 'Oslo',
  }],
  fnr: '1234567',
  region: {
    kode: region.NORDEN,
    kodeverk: 'REGION',
  },
  barn: [],
};

export const visVisittkortNårEnHarBegrensetMedInformasjon = () => (
  <VisittkortSakIndex
    fagsak={fagsak}
    familieHendelse={familieHendelse}
    lenkeTilAnnenPart="testlenke til annen part"
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);

export const visVisittkortNårEnHarPersonopplysninger = () => (
  <VisittkortSakIndex
    fagsak={fagsak}
    personopplysninger={personopplysningerSoker}
    familieHendelse={familieHendelse}
    lenkeTilAnnenPart="testlenke til annen part"
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);

export const visVisittkortNårEnHarPersonopplysningerForBeggeParter = () => (
  <VisittkortSakIndex
    fagsak={fagsak}
    personopplysninger={{
      ...personopplysningerSoker,
      annenPart: personopplysningerAnnenPart,
    }}
    familieHendelse={familieHendelse}
    lenkeTilAnnenPart="testlenke til annen part"
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);

export const visVisittkortForAnnenPartDerAktørIdErUkjent = () => (
  <VisittkortSakIndex
    fagsak={fagsak}
    personopplysninger={{
      ...personopplysningerSoker,
      annenPart: {
        ...personopplysningerAnnenPart,
        aktoerId: undefined,
      },
    }}
    familieHendelse={familieHendelse}
    lenkeTilAnnenPart="testlenke til annen part"
    alleKodeverk={alleKodeverk as any}
    sprakkode={{ kode: 'NN', kodeverk: 'SPRAK' }}
  />
);
