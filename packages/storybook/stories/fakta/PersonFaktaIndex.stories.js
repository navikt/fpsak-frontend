import React from 'react';
import { withKnobs, object } from '@storybook/addon-knobs';

import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
};

const personopplysninger = {
  barn: [{
    navn: 'Espen Utvikler jr.',
    fnr: '12324435',
    navBrukerKjonn: {
      kode: navBrukerKjonn.MANN,
    },
    soktForBarn: true,
  }],
  navn: 'Espen Utviklar',
  fodselsdato: '2019-01-01',
  fnr: '123456789',
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
  },
  diskresjonskode: {
    kode: diskresjonskodeType.KODE6,
  },
  personstatus: {
    kode: personstatusType.BOSATT,
  },
  harVerge: false,
  annenPart: {
    navn: 'Petra Utviklar',
    fodselsdato: '2019-01-01',
    fnr: '123456789',
    navBrukerKjonn: {
      kode: navBrukerKjonn.UDEFINERT,
    },
    diskresjonskode: {
      kode: diskresjonskodeType.UDEFINERT,
    },
    personstatus: {
      kode: personstatusType.BOSATT,
    },
    harVerge: false,
  },
  adresser: [{
    adresseType: {
      kode: opplysningAdresseType.BOSTEDSADRESSE,
    },
    adresselinje1: 'veien 1',
    adresselinje2: '1000',
    adresselinje3: 'Oslo',
    land: landkoder.NORGE,
  }, {
    adresseType: {
      kode: opplysningAdresseType.POSTADRESSE,
    },
    adresselinje1: 'veien 1',
    adresselinje2: '1000',
    adresselinje3: 'Oslo',
    land: landkoder.NORGE,
  }],
};

const fagsakPerson = {
  erKvinne: false,
  dodsdato: '2019-01-01',
  diskresjonskode: diskresjonskodeType.UDEFINERT,
  erDod: true,
  alder: 90,
  navn: 'Espen Utvikler',
  personnummer: '123456789',
};

export default {
  title: 'fakta/fakta-person',
  component: PersonFaktaIndex,
  decorators: [withKnobs],
};

export const visPanelForBeggeParter = () => (
  <PersonFaktaIndex
    behandling={object('behandling', behandling)}
    personopplysninger={object('personopplysninger', personopplysninger)}
    fagsakPerson={object('fagsakPerson', fagsakPerson)}
    alleKodeverk={alleKodeverk}
  />
);

export const visPanelForGrunnleggendePersoninfo = () => (
  <PersonFaktaIndex
    behandling={object('behandling', behandling)}
    fagsakPerson={object('fagsakPerson', fagsakPerson)}
    alleKodeverk={alleKodeverk}
  />
);
