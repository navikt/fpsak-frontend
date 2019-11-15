import React from 'react';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import BarnePanel from './BarnePanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-person';

describe('<BarnePanel>', () => {
  const barn1 = {
    navn: 'barn test 1',
    fodselsdato: '2010-11-12',
    fodselsnummer: '189309 81748',
    navBrukerKjonn: { kode: navBrukerKjonn.KVINNE },
  };
  const barn2 = {
    navn: 'barn test 2',
    fodselsdato: '2010-11-12',
    fodselsnummer: '252143 98661',
    navBrukerKjonn: { kode: navBrukerKjonn.MANN },
  };
  const barn3 = {
    navn: 'barn test 3',
    fodselsdato: '2010-11-12',
    fodselsnummer: '252143 98661',
    navBrukerKjonn: { kode: navBrukerKjonn.MANN },
  };
  const barneListe = [barn1, barn2, barn3];

  it('skal sjekke at korrekt ikon vises for barna', () => {
    const wrapper = shallowWithIntl(<BarnePanel.WrappedComponent barneListe={barneListe} intl={intlMock} />);

    const image = wrapper.find(Image);
    expect(image.first().prop('title')).to.have.length.above(1);
    expect(image.at(1).prop('title')).to.have.length.above(1);
  });

  it('skal sjekke at korrekt antall barn vises', () => {
    const wrapper = shallowWithIntl(<BarnePanel.WrappedComponent barneListe={barneListe} intl={intlMock} />);
    expect(wrapper.find('Row').children()).to.have.length(barneListe.length);
  });
});
