import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
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
