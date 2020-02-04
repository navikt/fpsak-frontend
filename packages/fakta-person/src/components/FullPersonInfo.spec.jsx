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

import { FullPersonInfo } from './FullPersonInfo';
import AdressePanel from './AdressePanel';
import BarnePanel from './BarnePanel';

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
  },
  diskresjonskode: {
    kode: 'TEST',
  },
  region: {
    kode: landkoder.NORGE,
  },
  personstatus: {
    kode: personstatusType.BOSATT,
  },
  sivilstand: {
    kode: sivilstandType.SKILT,
  },
  avklartPersonstatus: {
    overstyrtPersonstatus: {
      kode: personstatusType.BOSATT,
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
  },
  {
    kode: personstatusType.UTVANDRET,
  },
  {
    kode: personstatusType.BOSATT,
  },
];

const sivilstandTypes = [
  {
    kode: sivilstandType.GIFTLEVERADSKILT,
  },
  {
    kode: sivilstandType.SKILT,
  },
];
const ytelser = [{}];
const relatertYtelseTypes = [{}];
const relatertYtelseStatus = [{}];

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === navBrukerKjonn.KVINNE) {
    return 'kvinne';
  }
  if (kodeverk.kode === landkoder.NORGE) {
    return 'Norge';
  }

  return '';
};


describe('<FullPersonInfo>', () => {
  it('Skal sjekke at adressepanel får korrekte props', () => {
    const wrapper = shallow(
      <FullPersonInfo
        behandlingId={1}
        behandlingVersjon={1}
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
        skalKunneLeggeTilNyeArbeidsforhold={false}
        getKodeverknavn={getKodeverknavn}
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

  // TODO (TOR) Fjern utkommentert test når opplysningskilde er fiksa
  xit('Skal sjekke at barnepanel får korrekte props', () => {
    const wrapper = shallow(
      <FullPersonInfo
        behandlingId={1}
        behandlingVersjon={1}
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
        skalKunneLeggeTilNyeArbeidsforhold={false}
        getKodeverknavn={getKodeverknavn}
        {...reduxFormPropsMock}
      />,
    );
    const barnepanel = wrapper.find(BarnePanel);
    expect(barnepanel.props().barneListe[0]).to.equal(barnITPS);
  });

  it('Skal ikke vise hjelpetekst for aksjonspunkt når en har aksjonspunkt og annen part er valgt', () => {
    const wrapper = shallow(
      <FullPersonInfo
        behandlingId={1}
        behandlingVersjon={1}
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
        skalKunneLeggeTilNyeArbeidsforhold={false}
        getKodeverknavn={getKodeverknavn}
        {...reduxFormPropsMock}
      />,
    );

    expect(wrapper.find(AksjonspunktHelpText)).has.length(0);
  });
});
