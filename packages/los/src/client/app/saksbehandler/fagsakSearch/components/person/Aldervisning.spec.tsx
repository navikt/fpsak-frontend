
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import DateLabel from 'sharedComponents/DateLabel';
import AlderVisning from './Aldervisning';

describe('<Aldervisning>', () => {
  it('skal sjekke at alder vises når person ikke er død', () => {
    const wrapper = shallow(<AlderVisning
      alder={40}
      erDod={false}
      dodsdato="01.01.2017"
    />);
    const aldervisning = wrapper.find('span');
    expect(aldervisning).to.have.length(1);
    expect(aldervisning.find(FormattedMessage).prop('values').age).to.equal(40);
  });

  it('skal sjekke at dødsdato vises når person er død og dødsdato er satt', () => {
    const wrapper = shallow(<AlderVisning
      alder={40}
      erDod
      dodsdato="01.01.2017"
    />);

    const aldervisningDod = wrapper.find(Normaltekst);
    expect(aldervisningDod).to.have.length(1);

    const formattedDate = wrapper.find(DateLabel);
    expect(formattedDate.prop('dateString')).to.equal('01.01.2017');
  });

  it('skal sjekke at default tekst vises for dødsdato når person er død og dødsdato mangler', () => {
    const wrapper = shallow(<AlderVisning
      alder={40}
      erDod
      dodsdato={undefined}
    />);

    const aldervisningDod = wrapper.find(Normaltekst);
    expect(aldervisningDod).to.have.length(1);
    expect(wrapper.find(FormattedMessage).prop('id')).to.equal('Person.ManglerDodsdato');
  });
});
