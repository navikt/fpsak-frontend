import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import opplysningsKilde from '@fpsak-frontend/kodeverk/src/opplysningsKilde';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { AdressePanel, BarnePanel, PersonYtelserTable } from '@fpsak-frontend/person-info';
import FullPersonInfo from './FullPersonInfo';
import PersonArbeidsforholdPanel from './arbeidsforhold/PersonArbeidsforholdPanel';

const barnITPS = {
  navn: 'Barn 1',
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
  },
  fnr: '01011712345',
  opplysningsKilde: {
    kode: opplysningsKilde.TPS,
  },
  fodselsdato: '2017-01-01',
  adresser: [
    {
      adresseType: {
        kode: opplysningAdresseType.BOSTEDSADRESSE,
      },
      adresselinje1: 'barneveien 5',
    },
  ],
};
const barnIkkeITPS = {
  navn: 'Barn 2',
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
  },
  fnr: '01011712347',
  opplysningsKilde: {
    kode: opplysningsKilde.SAKSBEHANDLER,
  },
  fodselsdato: '2017-01-02',
  adresser: [
    {
      adresseType: {
        kode: opplysningAdresseType.BOSTEDSADRESSE,
      },
      adresselinje1: 'borte 5',
    },
  ],
};


const sprakkode = {
  kode: 'BM',
};
const personopplysning = {
  navn: 'Person Personesen',
  alder: 20,
  personnummer: '01019750695',
  fodselsdato: '2011-04-15',
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
    navn: 'kvinne',
  },
  diskresjonskode: {
    kode: 'TEST',
    navn: 'test',
  },
  region: {
    kode: landkoder.NORGE,
    navn: 'Norge',
  },
  personstatus: {
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  },
  sivilstand: {
    kode: sivilstandType.SKILT,
    navn: 'Skilt',
  },
  avklartPersonstatus: {
    overstyrtPersonstatus: {
      kode: personstatusType.BOSATT,
      navn: 'Bosatt',
    },
  },
  barn: [barnIkkeITPS, barnITPS],
  adresser: [
    {
      adresseType: {
        kode: opplysningAdresseType.BOSTEDSADRESSE,
      },
      adresselinje1: 'Bostedet 5',
      postNummer: '1234',
      poststed: 'Bostedet',
    },
    {
      adresseType: {
        kode: opplysningAdresseType.POSTADRESSE,
      },
      adresselinje1: 'Postveien 5',
      postNummer: '1234',
      poststed: 'Posten',
    },
    {
      adresseType: {
        kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
      },
      adresselinje1: 'Utlandsveien 5',
      postNummer: '1234',
      poststed: 'Utlandet',

    },
    {
      adresseType: {
        kode: opplysningAdresseType.NORSK_NAV_TILLEGGSADRESSE,
      },
      adresselinje1: 'Tileggsveien 5',
      postNummer: '1234',
      poststed: 'Tilegget',
    },

  ],
};

const personstatusTypes = [
  {
    kode: personstatusType.UFULLSTENDIGFNR,
    navn: 'Ufullstendig fnr',
  },
  {
    kode: personstatusType.UTVANDRET,
    navn: 'Utvandret',
  },
  {
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  },
];

const sivilstandTypes = [
  {
    kode: sivilstandType.GIFTLEVERADSKILT,
    navn: 'Gift, lever adskilt',
  },
  {
    kode: sivilstandType.SKILT,
    navn: 'Skilt',
  },
];
const ytelser = [{}];
const relatertYtelseTypes = [{}];
const relatertYtelseStatus = [{}];


describe('<FullPersonInfo>', () => {
  it('Skal sjekke at adressepanel får korrekte props', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter={false}
        submitCallback={sinon.spy()}
        readOnly={false}
        hasAksjonspunkter={false}
        utlandSakstype=""
        isPrimaryParent
        {...reduxFormPropsMock}
      />,
    );
    const adressePanel = wrapper.find(AdressePanel);
    expect(adressePanel.props().bostedsadresse).to.equal('Bostedet 5, 1234 Bostedet');
    expect(adressePanel.props().postAdresseNorge).to.equal('Postveien 5, 1234 Posten');
    expect(adressePanel.props().postadresseUtland).to.equal('Utlandsveien 5, 1234 Utlandet');
    expect(adressePanel.props().midlertidigAdresse).to.equal('Tileggsveien 5, 1234 Tilegget');
    expect(adressePanel.props().region).to.equal('Norge');
    expect(adressePanel.props().personstatus.kode).to.equal(personstatusType.BOSATT);
    expect(adressePanel.props().sivilstandtype.kode).to.equal(sivilstandType.SKILT);
  });

  it('Skal sjekke at barnepanel får korrekte props', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter={false}
        readOnly={false}
        hasAksjonspunkter={false}
        utlandSakstype=""
        isPrimaryParent
        {...reduxFormPropsMock}
      />,
    );
    const barnepanel = wrapper.find(BarnePanel);
    expect(barnepanel.props().barneListe[0]).to.equal(barnITPS);
  });

  it('Skal vise panel for arbeidsforhold når søker er valgt', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter={false}
        readOnly={false}
        hasAksjonspunkter={false}
        utlandSakstype=""
        isPrimaryParent
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
  });

  it('Skal ikke vise panel for arbeidsforhold når annen part er valgt', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter={false}
        readOnly={false}
        hasAksjonspunkter={false}
        utlandSakstype=""
        isPrimaryParent={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(0);
  });

  it('Skal vise hjelpetekst for aksjonspunkt når en har aksjonspunkt og søker er valgt', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter
        readOnly={false}
        hasAksjonspunkter
        utlandSakstype=""
        isPrimaryParent
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(AksjonspunktHelpText)).has.length(1);
  });

  it('Skal ikke vise hjelpetekst for aksjonspunkt når en har aksjonspunkt og annen part er valgt', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter
        readOnly={false}
        hasAksjonspunkter
        utlandSakstype=""
        isPrimaryParent={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(AksjonspunktHelpText)).has.length(0);
  });

  it('Skal vise ytelsepanel når en har ytelser', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        ytelser={ytelser}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter
        readOnly={false}
        hasAksjonspunkter
        utlandSakstype=""
        isPrimaryParent={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(PersonYtelserTable)).has.length(1);
  });

  it('Skal ikke vise ytelsepanel når en ikke har ytelser', () => {
    const wrapper = shallow(
      <FullPersonInfo
        sprakkode={sprakkode}
        personopplysning={personopplysning}
        relatertYtelseTypes={relatertYtelseTypes}
        relatertYtelseStatus={relatertYtelseStatus}
        personstatusTypes={personstatusTypes}
        sivilstandTypes={sivilstandTypes}
        hasOpenAksjonspunkter
        readOnly={false}
        hasAksjonspunkter
        utlandSakstype=""
        isPrimaryParent={false}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(PersonYtelserTable)).has.length(0);
  });
});