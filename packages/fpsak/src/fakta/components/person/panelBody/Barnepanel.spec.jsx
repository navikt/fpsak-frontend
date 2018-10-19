import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import Barnepanel from './Barnepanel';

describe('<Barnepanel>', () => {
  const barn1 = {
    navn: 'barn test 1',
    fodselsDato: '2010-11-12',
    fodselsnummer: '189309 81748',
    navBrukerKjonn: { kode: navBrukerKjonn.KVINNE },
  };
  const barn2 = {
    navn: 'barn test 2',
    fodselsDato: '2010-11-12',
    fodselsnummer: '252143 98661',
    navBrukerKjonn: { kode: navBrukerKjonn.MANN },
  };
  const barn3 = {
    navn: 'barn test 3',
    fodselsDato: '2010-11-12',
    fodselsnummer: '252143 98661',
    navBrukerKjonn: { kode: navBrukerKjonn.MANN },
  };
  const barneListe = [barn1, barn2, barn3];

  it('skal sjekke at korrekt ikon vises for barna', () => {
    const wrapper = shallowWithIntl(<Barnepanel
      barneListe={barneListe}
    />);

    const image = wrapper.find('InjectIntl(Image)');
    expect(image.first().prop('titleCode')).to.equal('Person.Girl');
    expect(image.at(1).prop('titleCode')).to.equal('Person.Boy');
  });

  it('skal sjekke at korrekt antall barn vises', () => {
    const wrapper = shallowWithIntl(<Barnepanel
      barneListe={barneListe}
    />);
    expect(wrapper.find('Row').children()).to.have.length(barneListe.length);
  });
});
