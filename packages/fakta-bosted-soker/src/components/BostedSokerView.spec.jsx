import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { Tooltip } from '@fpsak-frontend/shared-components';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { Normaltekst } from 'nav-frontend-typografi';
import EtikettBase from 'nav-frontend-etiketter';
import { BostedSokerView } from './BostedSokerView';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-bosted-soker';

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
      personopplysninger={soker}
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
      sokerTypeTextId="BostedSokerFaktaIndex.Soker"
    />);

    expect(wrapper.find('Element').childAt(0).text()).to.eql('Espen Utvikler');
  });

  it('skal vise  adresse informasjon', () => {
    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      personopplysninger={soker}
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
      sokerTypeTextId="BostedSokerFaktaIndex.Soker"
    />);
    const adr = wrapper.find(Normaltekst);
    expect(adr).to.have.length(2);
    expect(adr.first().childAt(0).text()).to.eql('Vei 1, 1000 Oslo');
    expect(adr.last().childAt(0).text()).to.eql('-');
  });

  it('skal vise etiketter', () => {
    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      personopplysninger={soker}
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
      sokerTypeTextId="BostedSokerFaktaIndex.Soker"
    />);

    const tooltips = wrapper.find(Tooltip);
    expect(tooltips).to.have.length(3);
    const etikettfokus = wrapper.find(EtikettBase);
    expect(etikettfokus).to.have.length(3);
    expect(tooltips.at(0).prop('content')).to.equal('Personstatus');
    expect(etikettfokus.at(0).childAt(0).text()).to.equal('Bosatt');
    expect(tooltips.at(1).prop('content')).to.equal('Sivilstand');
    expect(etikettfokus.at(1).childAt(0).text()).to.equal('Ugift');
    expect(tooltips.at(2).prop('content')).to.equal('Region');
    expect(etikettfokus.at(2).childAt(0).text()).to.equal('Norden');
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    soker.avklartPersonstatus = null;
    soker.personstatus = {
      kode: '-',
    };

    const wrapper = shallowWithIntl(<BostedSokerView
      intl={intlMock}
      personopplysninger={soker}
      regionTypes={regionTypes}
      sivilstandTypes={sivilstandTypes}
      personstatusTypes={personstatusTypes}
      sokerTypeTextId="BostedSokerFaktaIndex.Soker"
    />);

    const tooltips = wrapper.find(Tooltip);
    expect(tooltips).to.have.length(3);
    const etikettfokus = wrapper.find(EtikettBase);
    expect(etikettfokus).to.have.length(3);
    expect(tooltips.at(0).prop('content')).to.equal('Personstatus');
    expect(etikettfokus.at(0).childAt(0).text()).to.equal('Ukjent');
    expect(tooltips.at(1).prop('content')).to.equal('Sivilstand');
    expect(etikettfokus.at(1).childAt(0).text()).to.equal('Ugift');
    expect(tooltips.at(2).prop('content')).to.equal('Region');
    expect(etikettfokus.at(2).childAt(0).text()).to.equal('Norden');
  });
});
