import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import PersonDetailedHeader from './panelHeader/PersonDetailedHeader';

const primaryParent = {
  navn: 'Parent 1',
  fnr: '26041150695',
  erKvinne: true,
  fodselsdato: '2011-04-15',
  navBrukerKjonn: {
    kode: navBrukerKjonn.KVINNE,
    navn: 'kvinne',
  },
  diskresjonskode: {
    kode: 'TEST',
    navn: 'test',
  },
  personstatus: {
    kode: 'Ukjent',
    navn: 'ukjent',
  },
};
const secondaryParent = {
  navn: 'Parent 2',
  fnr: '26041250525',
  erKvinne: false,
  fodselsdato: '2012-04-26',
  navBrukerKjonn: {
    kode: navBrukerKjonn.MANN,
    navn: 'kvinne',
  },
  diskresjonskode: {
    kode: 'TEST',
    navn: 'test',
  },
  personstatus: {
    kode: 'Ukjent',
    navn: 'ukjent',
  },
};

describe('<EkspanderbartPersonPanel>', () => {
  it('skal være to foreldre', () => {
    const wrapper = shallow(<EkspanderbartPersonPanel
      primaryParent={primaryParent}
      secondaryParent={secondaryParent}
      setSelected={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
    />);
    expect(wrapper.find(PersonDetailedHeader)).to.have.length(2);
  });

  it('skal sette props på foreldre', () => {
    const wrapper = shallow(<EkspanderbartPersonPanel
      primaryParent={primaryParent}
      secondaryParent={secondaryParent}
      setSelected={sinon.spy()}
      hasOpenAksjonspunkter
      readOnly={false}
    />);

    const parents = wrapper.find(PersonDetailedHeader);
    const parent1 = parents.first();
    const parent2 = parents.last();

    expect(parent1.prop('personopplysninger')).to.equal(primaryParent);
    expect(parent2.prop('personopplysninger')).to.equal(secondaryParent);
  });
});
