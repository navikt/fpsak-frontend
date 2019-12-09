import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import relatertYtelseType from '@fpsak-frontend/kodeverk/src/relatertYtelseType';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';

import withReduxProvider from '../../decorators/withRedux';

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

const inntektArbeidYtelse = {
  relatertTilgrensendeYtelserForSoker: [{
    relatertYtelseType: relatertYtelseType.FORELDREPENGER,
    tilgrensendeYtelserListe: [{
      periodeTilDato: '2019-01-01',
      periodeFraDato: '2019-02-02',
      status: relatertYtelseTilstand.LOPENDE,
      saksNummer: '1',
    }],
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

const toggle = (openInfoPanels, togglePanel) => (value) => {
  const exists = openInfoPanels.some((op) => op === value);
  return togglePanel(exists ? [] : [value]);
};

export default {
  title: 'fakta/fakta-person',
  component: PersonFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForBeggeParter = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.PERSON]);
  return (
    <PersonFaktaIndex
      behandling={object('behandling', behandling)}
      personopplysninger={object('personopplysninger', personopplysninger)}
      inntektArbeidYtelse={object('inntektArbeidYtelse', inntektArbeidYtelse)}
      fagsakPerson={object('fagsakPerson', fagsakPerson)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      featureToggleUtland
      alleKodeverk={alleKodeverk}
    />
  );
};

export const visPanelForGrunnleggendePersoninfo = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.PERSON]);
  return (
    <PersonFaktaIndex
      behandling={object('behandling', behandling)}
      fagsakPerson={object('fagsakPerson', fagsakPerson)}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      featureToggleUtland
      alleKodeverk={alleKodeverk}
    />
  );
};

export const visPanelForMarkertUtenlandssak = () => {
  const [openInfoPanels, togglePanel] = React.useState([faktaPanelCodes.PERSON]);
  return (
    <PersonFaktaIndex
      behandling={object('behandling', behandling)}
      fagsakPerson={object('fagsakPerson', {
        ...fagsakPerson,
        dodsdato: undefined,
        erDod: false,
      })}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      submitCallback={action('button-click')}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggle(openInfoPanels, togglePanel)}
      shouldOpenDefaultInfoPanels={false}
      readOnly={boolean('readOnly', false)}
      featureToggleUtland
      alleKodeverk={alleKodeverk}
    />
  );
};
