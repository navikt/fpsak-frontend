import React from 'react';
import { expect } from 'chai';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { Normaltekst } from 'nav-frontend-typografi';

import personstatusType from 'kodeverk/personstatusType';
import sivilstandType from 'kodeverk/sivilstandType';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import { AdressePanel } from './AdressePanel';

describe('<AdressePanel>', () => {
  const personstatusTypes = [{
    kode: personstatusType.UFULLSTENDIGFNR,
    navn: 'Ufullstendig fnr',
  }, {
    kode: personstatusType.UTVANDRET,
    navn: 'Utvandret',
  }, {
    kode: personstatusType.BOSATT,
    navn: 'Bosatt',
  }];
  const sivilstandTypes = [{
    kode: sivilstandType.GIFTLEVERADSKILT,
    navn: 'Gift, lever adskilt',
  }, {
    kode: sivilstandType.SKILT,
    navn: 'Skilt',
  }];

  it('skal sjekke at korrekt etikett vises om engelsk er valgt', () => {
    const sprakkode = {
      kode: 'EN',
    };

    const statsborgerskap = {
      navn: 'Norge',
    };

    const wrapper = shallowWithIntl(<AdressePanel
      intl={intlMock}
      sprakkode={sprakkode}
      region={statsborgerskap.navn}
      personstatus={{ kode: personstatusType.UFULLSTENDIGFNR, navn: 'Ufullstendig fnr' }}
      sivilstandtype={{ kode: sivilstandType.GIFTLEVERADSKILT, navn: 'Gift, lever adskilt' }}
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      isPrimaryParent
    />);

    const etikettfokus = wrapper.find(EtikettFokus);

    expect(etikettfokus.at(1).prop('title')).to.equal('Personstatus');
    expect(etikettfokus.at(1).children().text()).to.equal('Ufullstendig fnr');
    expect(etikettfokus.at(2).prop('title')).to.equal('Sivilstand');
    expect(etikettfokus.at(2).children().text()).to.equal('Gift, lever adskilt');
    expect(etikettfokus.at(3).prop('title')).to.equal('Foretrukket språk');
    expect(etikettfokus.at(3).children().text()).to.equal('Engelsk');
  });

  it('skal sjekke at korrekte etikett vises om ingen sivilstand er valgt', () => {
    const sprakkode = {
      kode: 'NN',
    };

    const statsborgerskap = {
      navn: 'Kongo',
    };

    const wrapper = shallowWithIntl(<AdressePanel
      intl={intlMock}
      sprakkode={sprakkode}
      region={statsborgerskap.navn}
      personstatus={{ kode: personstatusType.UTVANDRET, navn: 'Utvandret' }}
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      isPrimaryParent
    />);

    const etikettfokus = wrapper.find(EtikettFokus);

    expect(etikettfokus.at(0).prop('title')).to.equal('Statsborgerskap');
    expect(etikettfokus.at(0).children().text()).to.equal(statsborgerskap.navn);

    expect(etikettfokus.at(1).prop('title')).to.equal('Personstatus');
    expect(etikettfokus.at(1).children().text()).to.equal('Utvandret');

    expect(etikettfokus.at(2).prop('title')).to.equal('Foretrukket språk');
    expect(etikettfokus.at(2).children().text()).to.equal('Nynorsk');
  });

  it('skal sjekke at alle etiketter kan vises', () => {
    const sprakkode = {
      kode: 'BM',
    };

    const statsborgerskap = {
      navn: 'Danmark',
    };

    const wrapper = shallowWithIntl(<AdressePanel
      intl={intlMock}
      sprakkode={sprakkode}
      region={statsborgerskap.navn}
      personstatus={{ kode: personstatusType.BOSATT, navn: 'Bosatt' }}
      sivilstandtype={{ kode: sivilstandType.SKILT, navn: 'Skilt' }}
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      isPrimaryParent
    />);

    const etikettfokus = wrapper.find(EtikettFokus);
    expect(etikettfokus.at(0).prop('title')).to.equal('Statsborgerskap');
    expect(etikettfokus.at(0).children().text()).to.equal(statsborgerskap.navn);
    expect(etikettfokus.at(1).prop('title')).to.equal('Personstatus');
    expect(etikettfokus.at(1).children().text()).to.equal('Bosatt');
    expect(etikettfokus.at(2).prop('title')).to.equal('Sivilstand');
    expect(etikettfokus.at(2).children().text()).to.equal('Skilt');
    expect(etikettfokus.at(3).prop('title')).to.equal('Foretrukket språk');
    expect(etikettfokus.at(3).children().text()).to.equal('Bokmål');
  });


  it('skal sjekke at riktige adresser vises', () => {
    const sprakkode = {
      kode: 'BM',
    };
    const wrapper = shallowWithIntl(<AdressePanel
      intl={intlMock}
      sprakkode={sprakkode}
      personstatus={{ kode: personstatusType.BOSATT, navn: 'Bosatt' }}
      bostedsadresse="bostostedet 1"
      postAdresseNorge="postboks 2"
      midlertidigAdresse="midlertidig 3"
      postadresseUtland="utlandet 4"
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      isPrimaryParent
    />);

    const normaltekster = wrapper.find(Normaltekst);
    expect(normaltekster.at(0).children().text()).to.equal('bostostedet 1');
    expect(normaltekster.at(1).children().text()).to.equal('postboks 2');
    expect(normaltekster.at(2).children().text()).to.equal('midlertidig 3');
    expect(normaltekster.at(3).children().text()).to.equal('utlandet 4');
  });

  it('skal sjekke at alle etiketter unntatt språk kan vises for annenforelder', () => {
    const sprakkode = {
      kode: 'BM',
    };

    const statsborgerskap = {
      navn: 'Danmark',
    };

    const wrapper = shallowWithIntl(<AdressePanel
      intl={intlMock}
      sprakkode={sprakkode}
      region={statsborgerskap.navn}
      personstatus={{ kode: personstatusType.BOSATT, navn: 'Bosatt' }}
      sivilstandtype={{ kode: sivilstandType.SKILT, navn: 'Skilt' }}
      personstatusTypes={personstatusTypes}
      sivilstandTypes={sivilstandTypes}
      isPrimaryParent={false}
    />);

    const etikettfokus = wrapper.find(EtikettFokus);
    expect(etikettfokus).to.have.length(3);
    expect(etikettfokus.at(0).prop('title')).to.equal('Statsborgerskap');
    expect(etikettfokus.at(0).children().text()).to.equal(statsborgerskap.navn);
    expect(etikettfokus.at(1).prop('title')).to.equal('Personstatus');
    expect(etikettfokus.at(1).children().text()).to.equal('Bosatt');
    expect(etikettfokus.at(2).prop('title')).to.equal('Sivilstand');
    expect(etikettfokus.at(2).children().text()).to.equal('Skilt');
  });
});
