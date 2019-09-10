import React from 'react';

import { expect } from 'chai';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Image } from '@fpsak-frontend/shared-components';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import PersonInfo from './PersonInfo';
import AlderVisning from './Aldervisning';
import MerkePanel from './Merkepanel';

describe('<PersonInfo>', () => {
  it('skal sjekke at props blir brukt korrekt', () => {
    const person = {
      navn: 'frida',
      alder: 40,
      personnummer: '12345678910',
      erKvinne: true,
      erDod: false,
      erVerge: true,
      diskresjonskode: '6',
      dodsdato: '2017.01.01',
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent
      intl={intlMock}
      person={person}
      isPrimaryParent
      medPanel
    />);

    const image = wrapper.find(Image);
    expect(image.prop('alt')).to.have.length.above(1);
    expect(image.prop('title')).to.have.length.above(1);

    const innholdstittel = wrapper.find(Undertittel);
    expect(innholdstittel.childAt(0).text()).to.eql('frida');

    const aldervisning = wrapper.find(AlderVisning);
    expect(aldervisning.prop('alder')).to.eql(40);

    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst.childAt(0).text()).to.eql('12345678910');

    const merkepanel = wrapper.find(MerkePanel);
    expect(merkepanel.prop('erDod')).is.false;
    expect(merkepanel.prop('diskresjonskode')).to.eql('6');
  });

  it('skal vise annen title når søker er mann ', () => {
    const person = {
      navn: 'Espen',
      alder: 40,
      personnummer: '12345678910',
      erKvinne: false,
      erDod: false,
      erVerge: true,
      diskresjonskode: '6',
      dodsdato: '2017.01.01',
    };
    const wrapper = shallowWithIntl(<PersonInfo.WrappedComponent
      intl={intlMock}
      person={person}
      isPrimaryParent
      medPanel
    />);

    const image = wrapper.find(Image);
    expect(image.prop('title')).to.have.length.above(1);
  });
});
