import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import Image from 'sharedComponents/Image';
import urlKvinne from 'images/kvinne.svg';
import urlMann from 'images/mann.svg';
import urlUkjent from 'images/ukjent.svg';
import PersonDetailedHeader from './PersonDetailedHeader';

describe('<PersonDetailedHeader>', () => {
  it('skal vise ikon for ukjent kjønn når kjønn er udefinert', () => {
    const personopplysninger = {
      navn: 'Espen utvikler',
      fodselsdato: '2015-01-01',
      fnr: '123456789',
      navBrukerKjonn: {
        kode: navBrukerKjonn.UDEFINERT,
      },
    };
    const wrapper = shallow(<PersonDetailedHeader
      personopplysninger={personopplysninger}
      hasAktorId
      isPrimaryParent={false}
      medPanel
    />);

    expect(wrapper.find(Image).prop('src')).to.equal(urlUkjent);
  });

  it('skal vise ikon for mann', () => {
    const personopplysninger = {
      navn: 'Espen utvikler',
      fodselsdato: '2015-01-01',
      fnr: '123456789',
      navBrukerKjonn: {
        kode: navBrukerKjonn.MANN,
      },
    };
    const wrapper = shallow(<PersonDetailedHeader
      personopplysninger={personopplysninger}
      hasAktorId
      isPrimaryParent={false}
      medPanel
    />);

    expect(wrapper.find(Image).prop('src')).to.equal(urlMann);
  });

  it('skal vise ikon for kvinne', () => {
    const personopplysninger = {
      navn: 'Espen utvikler',
      fodselsdato: '2015-01-01',
      fnr: '123456789',
      navBrukerKjonn: {
        kode: navBrukerKjonn.KVINNE,
      },
    };
    const wrapper = shallow(<PersonDetailedHeader
      personopplysninger={personopplysninger}
      hasAktorId
      isPrimaryParent={false}
      medPanel
    />);

    expect(wrapper.find(Image).prop('src')).to.equal(urlKvinne);
  });
});
