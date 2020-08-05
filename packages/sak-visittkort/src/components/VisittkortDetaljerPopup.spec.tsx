import React from 'react';
import { expect } from 'chai';
import { EtikettInfo } from 'nav-frontend-etiketter';

import { FlexColumn, FlexRow, Tooltip } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-sak-visittkort';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';

describe('<VisittkortDetaljerPopup>', () => {
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

  it('skal vise etiketter', () => {
    const wrapper = shallowWithIntl(<VisittkortDetaljerPopup.WrappedComponent
      intl={intlMock}
      personopplysninger={personopplysningerSoker}
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    expect(wrapper.find(EtikettInfo)).has.length(4);
    const tooltips = wrapper.find(Tooltip);
    expect(tooltips).has.length(4);
    expect(tooltips.at(0).prop('content')).is.eql('Statsborgerskap');
    expect(tooltips.at(1).prop('content')).is.eql('Personstatus');
    expect(tooltips.at(2).prop('content')).is.eql('Sivilstand');
    expect(tooltips.at(3).prop('content')).is.eql('Foretrukket språk');
  });

  it('skal vise adresser', () => {
    const wrapper = shallowWithIntl(<VisittkortDetaljerPopup.WrappedComponent
      intl={intlMock}
      personopplysninger={personopplysningerSoker}
      alleKodeverk={{}}
      sprakkode={{ kode: 'NN', kodeverk: '' }}
    />);

    const rader = wrapper.find(FlexRow);
    expect(rader).has.length(5);
    const kolonne2ForRad2 = rader.at(1).find(FlexColumn).at(1);
    expect(kolonne2ForRad2.childAt(0).childAt(0).text()).is.eql('Oslo,');
  });
});
