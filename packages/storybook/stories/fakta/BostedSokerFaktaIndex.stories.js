import React from 'react';
import { withKnobs, object } from '@storybook/addon-knobs';

import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import region from '@fpsak-frontend/kodeverk/src/region';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';

import alleKodeverk from '../mocks/alleKodeverk.json';

const personopplysninger = {
  navn: 'Espen Utvikler',
  adresser: [{
    adresseType: {
      kode: opplysningAdresseType.BOSTEDSADRESSE,
    },
    adresselinje1: 'Sentrum',
    adresselinje2: '1010',
    adresselinje3: 'Oslo',
    land: landkoder.NORGE,
  }],
  sivilstand: {
    kode: sivilstandType.UOPPGITT,
    kodeverk: 'SIVILSTAND_TYPE',
  },
  region: {
    kode: region.NORDEN,
    kodeverk: 'REGION',
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    kodeverk: 'PERSONSTATUS_TYPE',
  },
};

export default {
  title: 'fakta/fakta-bosted-soker',
  component: BostedSokerFaktaIndex,
  decorators: [withKnobs],
};

export const visPanelForInformasjonOmSøkersBosted = () => (
  <div style={{ padding: '50px' }}>
    <BostedSokerFaktaIndex
      personopplysninger={object('personopplysninger', personopplysninger)}
      alleKodeverk={alleKodeverk}
    />
  </div>
);
