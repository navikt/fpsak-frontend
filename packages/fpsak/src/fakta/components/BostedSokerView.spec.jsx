import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import personstatusType from 'kodeverk/personstatusType';
import sivilstandType from 'kodeverk/sivilstandType';
import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import { BostedSokerView } from './BostedSokerView';

describe('<BostedsokerView>', () => {
  const soker = {
    navn: 'Espen Utvikler',
    aktoerId: '1',
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
    },
    avklartPersonstatus: {
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        navn: 'Bosatt',
      },
      orginalPersonstatus: {
        kode: personstatusType.DOD,
        navn: 'Bosatt',
      },
    },
    navBrukerKjonn: {
      kode: '',
      navn: '',
    },
    statsborgerskap: {
      kode: '',
      navn: '',
    },
    diskresjonskode: {
      kode: '',
      navn: '',
    },
    sivilstand: {
      kode: sivilstandType.UGIFT,
      navn: 'Ugift',
    },
    region: {
      kode: 'NORDEN',
      navn: 'Norden',
    },
    opplysningsKilde: {
      kode: '',
      navn: '',
    },
    adresser: [{
      adresselinje1: 'Vei 1',
      postNummer: '1000',
      poststed: 'Oslo',
      adresseType: {
        kode: opplysningAdresseType.POSTADRESSE,
        navn: 'Bostedsadresse',
      },
    }],
  };

  const regionTypes = [{
    kode: 'NORDEN',
    navn: 'Norden',
  }];
  const sivilstandTypes = [{
    kode: sivilstandType.UGIFT,
    navn: 'Ugift',
  }];
  const personstatusTypes = [{
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  }, {
    kode: personstatusType.DOD,
    navn: 'Bosatt',
  }];

  it('vise navn', () => {
    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      soker={soker}
      typeSoker="Søker"
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
    />);

    expect(wrapper.find('Element').childAt(0).text()).to.eql('Espen Utvikler');
  });

  it('skal vise  adresse informasjon', () => {
    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      soker={soker}
      typeSoker="Søker"
      className="defaultBostedSoker"
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
    />);
    const adr = wrapper.find('Normaltekst');
    expect(adr).to.have.length(2);
    expect(adr.first().childAt(0).text()).to.eql('Vei 1, 1000 Oslo');
    expect(adr.last().childAt(0).text()).to.eql('-');
  });

  it('skal vise etiketter', () => {
    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      soker={soker}
      typeSoker="Søker"
      className="defaultBostedSoker"
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
    />);
    const etikettfokus = wrapper.find('EtikettBase');
    expect(etikettfokus).to.have.length(3);
    const personstatus = etikettfokus.at(0);
    expect(personstatus.prop('title')).to.equal('Personstatus');
    expect(personstatus.childAt(0).text()).to.equal('Bosatt');
    const sivilstand = etikettfokus.at(1);
    expect(sivilstand.prop('title')).to.equal('Sivilstand');
    expect(sivilstand.childAt(0).text()).to.equal('Ugift');
    const region = etikettfokus.at(2);
    expect(region.prop('title')).to.equal('Region');
    expect(region.childAt(0).text()).to.equal('Norden');
  });
});
