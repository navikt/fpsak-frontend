import React from 'react';

import { expect } from 'chai';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Image } from '@fpsak-frontend/shared-components';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import PersonInfo from './PersonInfo';

describe('<PersonInfo>', () => {
  it('skal sjekke at props blir brukt korrekt', () => {
    const person = {
      navn: 'frida',
      alder: 40,
      personnummer: '12345678910',
      erKvinne: true,
      erDod: false,
      erVerge: true,
      dodsdato: '2017.01.01',
      personstatusType: {
        kode: '',
        kodeverk: '',
      },
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent
      intl={intlMock}
      person={person}
    />);
    const image = wrapper.find(Image);
    expect(image.prop('alt')).to.have.length.above(1);
    expect(image.prop('tooltip')).to.have.length.above(1);

    const innholdstittel = wrapper.find(Undertittel);
    expect(innholdstittel.childAt(0).text()).to.eql('frida ');

    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst.childAt(0).text()).to.eql('12345678910');
  });

  it('skal vise annen title når søker er mann ', () => {
    const person = {
      navn: 'Espen',
      alder: 40,
      personnummer: '12345678910',
      erKvinne: false,
      erDod: false,
      erVerge: true,
      dodsdato: '2017.01.01',
      personstatusType: {
        kode: '',
        kodeverk: '',
      },
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent
      intl={intlMock}
      person={person}
    />);

    const image = wrapper.find(Image);
    expect(image.prop('tooltip')).to.have.length.above(1);
  });
});
