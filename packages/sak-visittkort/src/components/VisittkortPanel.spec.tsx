import React from 'react';
import { expect } from 'chai';
import { PersonCard, Gender, EmptyPersonCard } from '@navikt/nap-person-card';

import { FlexContainer } from '@fpsak-frontend/shared-components';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-visittkort';
import VisittkortBarnInfoPanel from './VisittkortBarnInfoPanel';
import VisittkortPanel from './VisittkortPanel';

describe('<VisittkortPanel>', () => {
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
      navn: 'Olga Utvikler',
      alder: 41,
      personnummer: '1234567',
      erKvinne: true,
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
    fodselsdato: '1990-01-01',
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


  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    const wrapper = shallowWithIntl(<VisittkortPanel.WrappedComponent
      intl={intlMock}
      fagsak={fagsak}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart="testlenke"
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    expect(wrapper.find(FlexContainer)).has.length(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(fagsak.person.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(fagsak.person.personnummer);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    const wrapper = shallowWithIntl(<VisittkortPanel.WrappedComponent
      intl={intlMock}
      fagsak={fagsak}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart="testlenke"
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
      harTilbakekrevingVerge
    />);

    expect(wrapper.find(FlexContainer)).has.length(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(fagsak.person.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(fagsak.person.personnummer);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    const wrapper = shallowWithIntl(<VisittkortPanel.WrappedComponent
      intl={intlMock}
      fagsak={fagsak}
      personopplysninger={personopplysningerSoker}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart="testlenke"
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    expect(wrapper.find(FlexContainer)).has.length(1);
    expect(wrapper.find(VisittkortBarnInfoPanel)).has.length(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(personopplysningerSoker.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(personopplysningerSoker.fnr);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });

  it('skal vise visittkort for annen part', () => {
    const wrapper = shallowWithIntl(<VisittkortPanel.WrappedComponent
      intl={intlMock}
      fagsak={fagsak}
      personopplysninger={{
        ...personopplysningerSoker,
        annenPart: personopplysningerAnnenPart,
      }}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart="testlenke"
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    expect(wrapper.find(FlexContainer)).has.length(1);
    expect(wrapper.find(VisittkortBarnInfoPanel)).has.length(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(2);
    expect(visittkort.first().prop('name')).is.eql(personopplysningerSoker.navn);
    expect(visittkort.first().prop('fodselsnummer')).is.eql(personopplysningerSoker.fnr);
    expect(visittkort.first().prop('gender')).is.eql(Gender.female);

    expect(visittkort.last().prop('name')).is.eql(personopplysningerAnnenPart.navn);
    expect(visittkort.last().prop('fodselsnummer')).is.eql(personopplysningerAnnenPart.fnr);
    expect(visittkort.last().prop('gender')).is.eql(Gender.male);
  });

  it('skal vise visittkort for ukjent søker når annen part mangler aktør-id', () => {
    const wrapper = shallowWithIntl(<VisittkortPanel.WrappedComponent
      intl={intlMock}
      fagsak={fagsak}
      personopplysninger={{
        ...personopplysningerSoker,
        annenPart: {
          ...personopplysningerAnnenPart,
          aktoerId: undefined,
        },
      }}
      familieHendelse={familieHendelse}
      lenkeTilAnnenPart="testlenke"
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    expect(wrapper.find(FlexContainer)).has.length(1);
    expect(wrapper.find(VisittkortBarnInfoPanel)).has.length(1);
    expect(wrapper.find(PersonCard)).has.length(1);
    const tomtVisittkort = wrapper.find(EmptyPersonCard);
    expect(tomtVisittkort).has.length(1);
    expect(tomtVisittkort.prop('namePlaceholder')).is.eql('Ukjent navn, mangler norsk id-nr');
  });
});
